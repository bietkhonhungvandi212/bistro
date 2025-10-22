import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { isEmpty, isNil } from 'lodash';
import { NODE_ENV } from 'src/app.config';
import { TransactionHost } from 'src/services/prisma/transactions/transaction-host';
import { Transactional } from 'src/services/prisma/transactions/transactional.decorator';
import { StorageService } from 'src/services/storage/storage.service';
import { TRANSACTION_TIMEOUT } from 'src/shared/constants/prisma.constant';
import { CLD_UPLOAD_IMAGE_OPTIONS, IMAGE_TYPE } from 'src/shared/constants/storage.constant';
import { AssetFileNotExisted } from 'src/shared/exceptions/asset-file-not-existed.exception';
import { WriteFailedException } from 'src/shared/exceptions/write-fail-exception';
import { WriteRelationNotFoundException } from 'src/shared/exceptions/write-relation-not-found.exception';
import { Nil } from 'src/shared/generics/type.helper';
import { AuthUserDTO } from '../auth/dto/auth-user.dto';
import { FileLinkDTO } from './dto/file-link.dto';
import { FileCreateREQ } from './request/file-create.request';
import { FileUploadSignedUrlREQ } from './request/file-upload-signed-url.request';
import { FileRESP } from './response/file.response';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);
  constructor(
    private readonly transactionHost: TransactionHost,
    private readonly storageService: StorageService,
  ) {}

  @Transactional(TRANSACTION_TIMEOUT)
  async uploadFile(user: AuthUserDTO, file: Express.Multer.File, body: FileCreateREQ) {
    try {
      const result = await this.storageService.uploadFile(file, CLD_UPLOAD_IMAGE_OPTIONS, FileCreateREQ.toSharpOptions(body));

      const asset = await this.transactionHost.tx.file.create({
        data: FileCreateREQ.fromCLDApiResponse(user, result as any),
        select: { id: true, url: true },
      });

      return asset;
    } catch (error) {
      this.logger.error(error);
      throw new Error('Failed to upload file');
    }
  }

  @Transactional()
  async createSignedFile(body: FileUploadSignedUrlREQ) {
    const imageType = body.imageType ?? IMAGE_TYPE;
    const publicId = `${body.folder}/${body.fileName}_${new Date().getTime().toString().substring(6)}`;
    const result = await this.storageService.createSignedUploadUrl(publicId, imageType, {
      folder: body.folder,
      eager: body.eager,
    });

    const file = await this.transactionHost.tx.file.create({
      data: FileUploadSignedUrlREQ.fromSignedUrl(body, result as any),
      select: { id: true, url: true },
    });

    const uploadedUrl = `${result.url}?api_key=${result.api_key}&public_id=${publicId}&timestamp=${result.timestamp}&signature=${result.signature}`;

    const resposne = { fileId: file.id, uploadedUrl };

    return resposne;
  }

  async checkFileUploaded(fileId: Nil<number>) {
    if (isNil(fileId)) return;
    const file = await this.transactionHost.tx.file.findUniqueOrThrow({
      where: { id: fileId },
      select: { id: true, publicId: true },
    });
    return this.storageService.checkFileExist(file.publicId);
  }

  async detail(id: Nil<number>) {
    if (isNil(id)) return null;
    const file = await this.transactionHost.tx.file.findUniqueOrThrow({
      where: { id },
      select: FileRESP.querySelect(),
    });
    return FileRESP.fromEntity(file as any, await this.storageService.getStorageFile(file.publicId));
  }

  @Transactional(TRANSACTION_TIMEOUT)
  async enableUploaded(fileIds: number[]) {
    await this.transactionHost.tx.file.updateMany({ where: { id: { in: fileIds } }, data: { isUploaded: true } });
  }

  /* Delete file */
  async delete(id: number) {
    const file = await this.transactionHost.tx.file.findUniqueOrThrow({ where: { id }, select: { publicId: true } });
    await this.transactionHost.tx.$executeRaw`DELETE FROM files WHERE id = ${id}`;
    await this.storageService.deleteFile(file.publicId);
  }

  /* Delete multi files */
  @Transactional(TRANSACTION_TIMEOUT)
  async deleteMany(fileIds: number[]) {
    if (fileIds.length === 0) return;
    const files = await this.transactionHost.tx.file.findMany({
      where: { id: { in: fileIds } },
      select: { id: true, publicId: true },
    });

    await this.storageService.deleteManyFiles(files.map((f) => f.publicId));
    await this.transactionHost.tx.$executeRaw`DELETE FROM files WHERE id IN (${Prisma.join(fileIds)})`;
  }

  async checkFileLinked(fileIds: number[]) {
    const linkedFiles = await this.transactionHost.tx.file.findMany({
      where: { id: { in: fileIds } },
      select: FileLinkDTO.fileSelect(),
    });
    if (linkedFiles.filter((f) => FileLinkDTO.isLinked(f)).length !== 0)
      throw new WriteFailedException('update', 'These specified files had been linked already');
  }

  async checkAttachmentUploadedOrThrow(fileIds: number[]) {
    if (!fileIds || isEmpty(fileIds)) return;
    try {
      const fileUploadStatus = await this.checkManyFileUploaded(fileIds);
      //TODO: Fix rate limit
      const isAttachment = fileIds.length !== 0;
      if (isAttachment && !fileUploadStatus.isAllUploaded && NODE_ENV === 'production')
        throw new AssetFileNotExisted(fileUploadStatus.notUploadedFileIds);
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        const error = new WriteRelationNotFoundException('create', 'File', `File(s) not found id = ${fileIds.join(', ')}`);
        this.logger.error('File not found', error);
      }

      this.logger.error(e);
    }
  }

  async checkManyFileUploaded(fileIds: number[]): Promise<{ isAllUploaded: boolean; notUploadedFileIds: number[] }> {
    type FileStatus = { isUploaded: boolean; id: number };
    const promises = fileIds.map(
      (id) =>
        new Promise<FileStatus>(async (res, rej) => {
          try {
            const isUploaded = await this.checkFileUploaded(id);
            res({ isUploaded, id });
          } catch (e) {
            // File not exist in database
            rej(e);
          }
        }),
    );

    const fileStatuses = await Promise.all(promises);
    const notUploadedFiles = fileStatuses.filter((f) => !f.isUploaded);
    return { isAllUploaded: notUploadedFiles.length <= 0, notUploadedFileIds: notUploadedFiles.map((f) => f.id) };
  }
}

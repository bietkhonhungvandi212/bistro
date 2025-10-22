import { Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { isNil, isNull } from 'lodash';
import { TransactionHost } from 'src/services/prisma/transactions/transaction-host';
import { Transactional } from 'src/services/prisma/transactions/transactional.decorator';
import { StorageService } from 'src/services/storage/storage.service';
import { TRANSACTION_TIMEOUT } from 'src/shared/constants/prisma.constant';
import { ActionFailed, ActionFailedException } from 'src/shared/exceptions/action-failed.exception';
import { Nil } from 'src/shared/generics/type.helper';
import { connectRelation } from 'src/shared/helpers/prisma.helper';
import { FileService } from '../file/file.service';
import { ImageVersionRESP } from './response/image-version.response';
import { ImageRESP } from './response/image.response';

@Injectable()
export class ImageService {
  constructor(
    private readonly transactionHost: TransactionHost,
    private readonly fileService: FileService,
    private readonly storageService: StorageService,
  ) {}

  /* Quy trình upload ảnh
    1. Tạo entity (validate xong tất cả)
    1. Tạo ảnh (gồm kiểm tra attachment đã upload & file đã link)
    2. Tạo các phiên bản ảnh tối ưu
    3. Link ảnh với entity
    4. Enable ảnh
  */

  async verifyImages(fileIds: number[]) {
    await this.fileService.checkAttachmentUploadedOrThrow(fileIds);
    // await this.fileService.checkFileLinked(fileIds);
  }

  // @Transactional(TRANSACTION_TIMEOUT)
  // async createImages(fileIds: number[]) {
  //   /* 1. Create image */
  //   const createdImageIds = [];
  //   for (const fileId of fileIds) {
  //     const image = await this.transactionHost.tx.file.create({
  //       data: ImageCreateDTO.toCreateInput(fileId),
  //       select: { id: true },
  //     });
  //     createdImageIds.push(image.id);
  //   }

  //   /* 2. Create optimized image versions */
  //   return createdImageIds;
  // }

  async getImage(imageId: Nil<number>) {
    if (isNil(imageId)) return null;
    const image = await this.transactionHost.tx.file.findUnique({
      where: { id: imageId },
      include: { ImageVersions: { include: { File: true } } },
    });
    // const versions = await Promise.all(
    //   image.ImageVersions.map(async (v) => ImageVersionRESP.fromEntity(v, await this.storageService.getStorageFile(v.File.key))),
    // );
    const storage = await this.storageService.getStorageFile(image.publicId);
    const versions = ImageVersionRESP.mock(storage.url); // Mock
    return ImageRESP.fromEntity(image, storage, versions);
  }

  async getImageOriginal(imageId: Nil<number>): Promise<ImageRESP | null> {
    if (isNil(imageId)) return null;
    const image = await this.transactionHost.tx.file.findUnique({
      where: { id: imageId },
      include: { ImageVersions: { include: { File: true } } },
    });

    const storage = await this.storageService.getStorageFile(image.publicId);
    //TODO: Handle null storage
    return isNull(storage) ? null : ImageRESP.fromEntity(image, storage, []);
  }

  async enableImages(imageIds: number[]) {
    const images = await this.transactionHost.tx.file.findMany({
      where: { id: { in: imageIds } },
      select: { id: true, ImageVersions: { select: { id: true, fileId: true } } },
    });
    if (images.length !== imageIds.length)
      throw new ActionFailedException(
        ActionFailed.IMAGE_ENABLE_QUANTITY_NOT_MATCH,
        `Image quantity not match ${imageIds.length}/${images.length}`,
      );
    const fileIds = [];
    images.forEach((image) => {
      fileIds.push(image.id, ...image.ImageVersions.map((v) => v.fileId));
    });
    await this.fileService.enableUploaded(fileIds);
  }

  async deleteImage(imageId: number) {
    const image = await this.transactionHost.tx.file.findUniqueOrThrow({
      where: { id: imageId },
      include: { ImageVersions: true },
    });
    const fileIds = [image.id, ...image.ImageVersions.map((v) => v.fileId)];

    await this.transactionHost.tx.$executeRaw`DELETE FROM image_versions WHERE file_id IN (${Prisma.join(fileIds)})`;
    await this.fileService.deleteMany(fileIds);
  }

  @Transactional(TRANSACTION_TIMEOUT)
  async linkImageToAccount(accountId: number, fileId: number) {
    console.log('🚀 ~ ImageService ~ linkImageToAccount ~ accountId:', accountId);
    if (!fileId) return;
    /* 1. Check if attachment uploaded & create image */
    // await this.verifyImages([fileId]);

    /* 2. Remove old image */
    const account = await this.transactionHost.tx.account.findUniqueOrThrow({
      where: { id: accountId },
      select: { Avatar: { select: { id: true } } },
    });

    if (account.Avatar) await this.deleteImage(account.Avatar.id);

    /* 3. Create and link image */
    await this.transactionHost.tx.account.update({
      where: { id: accountId },
      data: { Avatar: connectRelation(fileId) },
    });

    /* 4. Enable Image & File */
    await this.enableImages([fileId]);
    return fileId;
  }

  async linkImageToCourse(courseId: number, fileId: number) {
    if (!courseId) throw new ActionFailedException(ActionFailed.COURSE_NOT_FOUND);
    if (!fileId) return;

    await this.verifyImages([fileId]);

    await this.transactionHost.tx.course.update({
      where: { id: courseId },
      data: { Image: connectRelation(fileId) },
    });

    /* 4. Enable Image & File */
    await this.enableImages([fileId]);
    return fileId;
  }
}

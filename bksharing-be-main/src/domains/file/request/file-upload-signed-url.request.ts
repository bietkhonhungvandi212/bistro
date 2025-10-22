import { Prisma } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ResourceType } from 'cloudinary';
import { CLD_FOLDER } from 'src/shared/constants/storage.constant';
import { NameValidator } from 'src/shared/request-validator/account.validator';

export class FileUploadSignedUrlREQ {
  @NameValidator()
  fileName: string;

  @IsString()
  resourceType: ResourceType;

  @IsEnum(CLD_FOLDER)
  folder: CLD_FOLDER;

  @IsString()
  @IsOptional()
  imageType?: string;

  @IsOptional()
  eager?: string;

  static fromSignedUrl(body: FileUploadSignedUrlREQ, result: any): Prisma.FileCreateInput {
    return {
      filename: body.fileName,
      publicId: result.publicId,
      url: result.url,
      resourceType: body.resourceType,
      signature: result.signature,
      uploadedAt: new Date().getTime(),
    };
  }
}

import { Prisma } from '@prisma/client';
import { IsNumber, IsOptional } from 'class-validator';
import { UploadApiResponse } from 'cloudinary';
import { SharpOptions } from 'sharp';
import { AuthUserDTO } from 'src/domains/auth/dto/auth-user.dto';
import { ISharpInputOptions } from 'src/services/storage/shared/interfaces/sharp.interface';
import { connectRelation } from 'src/shared/helpers/prisma.helper';

export class FileCreateREQ implements ISharpInputOptions {
  @IsNumber()
  @IsOptional()
  width?: number;

  @IsNumber()
  @IsOptional()
  height?: number;

  @IsOptional()
  options?: SharpOptions;

  static toSharpOptions(body: FileCreateREQ): ISharpInputOptions {
    return {
      width: body.width,
      height: body.height,
      options: body.options,
    };
  }

  static fromCLDApiResponse(user: AuthUserDTO, body: UploadApiResponse): Prisma.FileCreateInput {
    return {
      publicId: body.public_id,
      size: body.bytes,
      url: body.secure_url,
      version: body.version,
      resourceType: body.resource_type,
      signature: body.signature,
      uploadedAt: new Date(body.created_at).getMilliseconds(),
      Registrant: connectRelation(user?.accountId),
    };
  }
}

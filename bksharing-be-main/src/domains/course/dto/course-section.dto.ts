import { Type } from 'class-transformer';
import { ArrayMaxSize, IsArray, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { FileRESP } from 'src/domains/file/response/file.response';
import { COMMON_CONSTANT } from 'src/shared/constants/common.constant';
import { orNull } from 'src/shared/parsers/io.parser';
import { NameValidator } from 'src/shared/request-validator/account.validator';
import { BooleanValidator } from 'src/shared/request-validator/boolean.request-validator';
import { IdValidator } from 'src/shared/request-validator/id.validator';
import { CourseSectionGetPayload } from 'src/shared/types/payload-prisma';

export class CourseSectionAttachmentDTO {
  @IdValidator()
  fileId: number;

  @IsOptional()
  @BooleanValidator()
  isPublic: boolean = false;
}

export class CourseSectionDTO {
  @IdValidator()
  @IsOptional()
  id?: number;

  @NameValidator()
  title: string;

  @IsNumber()
  @IsOptional()
  ordinal?: number;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description: string;

  @BooleanValidator()
  isPublic: boolean = false;

  @IsArray()
  @Type(() => CourseSectionAttachmentDTO)
  @IsOptional()
  @ArrayMaxSize(COMMON_CONSTANT.ARRAY_MAX_SIZE)
  files?: CourseSectionAttachmentDTO[] = [];

  static fromEntity(e: CourseSectionGetPayload, files?: FileRESP[]): CourseSectionDTO {
    return {
      id: e.id,
      title: e.title,
      ordinal: e.ordinal,
      description: e.description,
      isPublic: e.isPublic,
      files: orNull(files),
    };
  }
}

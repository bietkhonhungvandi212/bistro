import { CourseStatus, Prisma, TargetAudience } from '@prisma/client';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsEnum, IsOptional, ValidateIf } from 'class-validator';
import { AuthUserDTO } from 'src/domains/auth/dto/auth-user.dto';
import { COMMON_CONSTANT } from 'src/shared/constants/common.constant';
import { SortOrder } from 'src/shared/enums/query.enum';
import { PaginationREQ } from 'src/shared/generics/pagination.request';
import { NameValidator } from 'src/shared/request-validator/account.validator';
import { ArrayNotDuplicated } from 'src/shared/request-validator/array-not-duplicated.request-validator';
import { QueryArray } from 'src/shared/request-validator/query-array.validator';
import { CourseSortableFields } from './enums';

export abstract class CourseBaseListREQ extends PaginationREQ {
  @IsOptional()
  @NameValidator()
  courseName?: string;

  @IsOptional()
  @IsEnum(CourseStatus)
  courseStatus?: CourseStatus;

  @IsArray()
  @ArrayNotDuplicated(TargetAudience)
  @ArrayMinSize(COMMON_CONSTANT.ARRAY_MIN_SIZE)
  @ArrayMaxSize(4)
  @IsOptional()
  @IsEnum(TargetAudience, { each: true })
  targetAudiences?: TargetAudience[];

  @IsOptional()
  @ArrayNotDuplicated(Number)
  @QueryArray({ fieldType: 'number', minSize: COMMON_CONSTANT.ARRAY_MIN_SIZE })
  categoryIds?: number[];

  @NameValidator()
  @IsOptional()
  creatorName?: string;

  @IsOptional()
  @IsEnum(CourseSortableFields)
  sortBy?: CourseSortableFields;

  @IsEnum(SortOrder)
  @ValidateIf((o) => o.sortBy)
  sortOrder: SortOrder = SortOrder.ASC;

  abstract toFindManyByAccount<T extends CourseBaseListREQ>(user: AuthUserDTO, query: T): Prisma.CourseFindManyArgs;
}

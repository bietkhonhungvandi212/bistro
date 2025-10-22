import { CourseStatus, TargetAudience } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { COMMON_CONSTANT } from 'src/shared/constants/common.constant';
import { NameValidator } from 'src/shared/request-validator/account.validator';
import { ArrayNotDuplicated } from 'src/shared/request-validator/array-not-duplicated.request-validator';
import { BooleanValidator } from 'src/shared/request-validator/boolean.request-validator';
import { IdValidator } from 'src/shared/request-validator/id.validator';
import { DateMonthYearCompare } from 'src/shared/request-validator/month-year-compare.request-validator';
import { OnlyDate } from 'src/shared/request-validator/only-date.request-validator';

export class CourseClientUpdateREQ {
  @NameValidator()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @IsNumber()
  @IsOptional()
  totalDuration?: number;

  @Min(0)
  @IsNumber()
  @IsOptional()
  price?: number;

  @IdValidator()
  @IsOptional()
  categoryId?: number;

  @IdValidator()
  @IsOptional()
  imageId?: number;

  @IsOptional()
  @BooleanValidator()
  isPublic?: boolean;

  @IsOptional()
  @IsEnum([CourseStatus.PENDING, CourseStatus.STOPPED, CourseStatus.ARCHIVED, CourseStatus.DRAFT])
  status?: CourseStatus;

  @IsNumber()
  @IsOptional()
  @Min(COMMON_CONSTANT.ZERO_VALUE)
  @Max(COMMON_CONSTANT.MAX_LIMIT_OF_STUDENTS)
  litmitOfStudents?: number;

  @IsArray()
  @Type(() => String)
  @IsOptional()
  @ArrayNotDuplicated(String)
  prerequisites?: string[];

  @IsArray()
  @Type(() => String)
  @IsOptional()
  @ArrayNotDuplicated(String)
  objectives: string[] = [];

  @IsArray()
  @IsOptional()
  @ArrayNotDuplicated(TargetAudience)
  @ArrayMinSize(COMMON_CONSTANT.ARRAY_MIN_SIZE)
  @ArrayMaxSize(COMMON_CONSTANT.ARRAY_MAX_SIZE)
  @IsEnum(TargetAudience, { each: true })
  targetAudiences?: TargetAudience[];

  @OnlyDate()
  @IsOptional()
  startDate?: string;

  @OnlyDate()
  @IsOptional()
  @DateMonthYearCompare({ startField: 'startDate' })
  endDate?: string;
}

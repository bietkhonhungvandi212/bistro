import { CourseStatus, Prisma, TargetAudience } from '@prisma/client';
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
import { AuthUserDTO } from 'src/domains/auth/dto/auth-user.dto';
import { COMMON_CONSTANT } from 'src/shared/constants/common.constant';
import { connectRelation } from 'src/shared/helpers/prisma.helper';
import { parsePrismaDate } from 'src/shared/parsers/datetime.parse';
import { NameValidator } from 'src/shared/request-validator/account.validator';
import { ArrayNotDuplicated } from 'src/shared/request-validator/array-not-duplicated.request-validator';
import { BooleanValidator } from 'src/shared/request-validator/boolean.request-validator';
import { IdValidator } from 'src/shared/request-validator/id.validator';
import { DateMonthYearCompare } from 'src/shared/request-validator/month-year-compare.request-validator';
import { OnlyDate } from 'src/shared/request-validator/only-date.request-validator';
import { CourseSectionDTO } from '../../dto/course-section.dto';

export class CourseClientCreateREQ {
  @NameValidator()
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description: string;

  @IsNumber()
  @Min(1)
  @Max(10)
  totalDuration: number;

  @IsNumber()
  @Min(1)
  @Max(10)
  limitOfStudents: number = 1;

  @Min(0)
  @IsNumber()
  price: number;

  @IdValidator()
  categoryId: number;

  @IdValidator()
  @IsOptional()
  imageId?: number;

  @BooleanValidator()
  isPublic: boolean;

  @IsEnum([CourseStatus.DRAFT, CourseStatus.PENDING])
  status: CourseStatus;

  @IsArray()
  @Type(() => String)
  prerequisites: string[];

  @IsArray()
  @Type(() => String)
  @ArrayNotDuplicated(String)
  objectives: string[];

  @IsArray()
  @ArrayNotDuplicated(TargetAudience)
  @ArrayMinSize(COMMON_CONSTANT.ARRAY_MIN_SIZE)
  @ArrayMaxSize(COMMON_CONSTANT.ARRAY_MAX_SIZE)
  @IsEnum(TargetAudience, { each: true })
  targetAudiences: TargetAudience[];

  @IsArray()
  @IsOptional()
  @Type(() => CourseSectionDTO)
  sections?: CourseSectionDTO[] = [];

  @OnlyDate()
  @IsOptional()
  startDate?: string;

  @OnlyDate()
  @IsOptional()
  @DateMonthYearCompare({ startField: 'startDate' })
  endDate?: string;

  static toCreateInput(user: AuthUserDTO, body: CourseClientCreateREQ): Prisma.CourseCreateArgs {
    return {
      data: {
        name: body.name,
        status: body.status,
        description: body.description,
        objectives: body.objectives,
        litmitOfStudents: body.limitOfStudents,
        targetAudiences: body.targetAudiences,
        prerequisites: body.prerequisites,
        totalDuration: body.totalDuration,
        price: body.price,
        startDate: parsePrismaDate(body.startDate),
        endDate: parsePrismaDate(body.endDate),
        Creator: connectRelation(user.accountId),
        Category: connectRelation(body.categoryId),
      },
      select: { id: true },
    };
  }
}

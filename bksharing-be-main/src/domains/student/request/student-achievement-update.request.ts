import { AchievementType } from '@prisma/client';
import { IsEnum, IsOptional, IsString, MaxLength, ValidateIf } from 'class-validator';
import { isUndefined } from 'lodash';
import { ActionFailed, ActionFailedException } from 'src/shared/exceptions/action-failed.exception';
import { parsePrismaDate } from 'src/shared/parsers/datetime.parse';
import { NameValidator } from 'src/shared/request-validator/account.validator';
import { BooleanValidator } from 'src/shared/request-validator/boolean.request-validator';
import { IdValidator } from 'src/shared/request-validator/id.validator';
import { DateMonthYearCompare } from 'src/shared/request-validator/month-year-compare.request-validator';
import { OnlyDate } from 'src/shared/request-validator/only-date.request-validator';

export class StudentAchievementUpdateREQ {
  @IdValidator()
  id: number;

  @NameValidator()
  @ValidateIf((o) => o.achievementType === AchievementType.CERTIFICATION)
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  organization?: string; // Can be company or institution or certification body

  @BooleanValidator()
  @IsOptional()
  isCurrent?: boolean;

  @IsEnum(AchievementType)
  @IsOptional()
  achievementType?: AchievementType;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  @ValidateIf((o) => o.achievementType === AchievementType.EXPERIENCE)
  position: string; // For experience

  @IsString()
  @MaxLength(255)
  @ValidateIf((o) => o.achievementType === AchievementType.EDUCATION)
  major?: string; // For education

  @OnlyDate()
  startDate?: string;

  @OnlyDate()
  @DateMonthYearCompare({ startField: 'startDate' })
  @ValidateIf((o) => !isUndefined(o.isCurrent) && o.isCurrent == false)
  endDate?: string;

  static ToUpdateByAchievementType(body: StudentAchievementUpdateREQ) {
    switch (body.achievementType) {
      case AchievementType.EXPERIENCE:
        return {
          organization: body.organization,
          description: body.description,
          position: body.position,
          isCurrent: body.isCurrent,
          startDate: parsePrismaDate(body.startDate),
          endDate: parsePrismaDate(body.endDate),
          type: AchievementType.EXPERIENCE,
        };
      case AchievementType.EDUCATION:
        return {
          organization: body.organization,
          description: body.description,
          major: body.major,
          isCurrent: body.isCurrent,
          startDate: parsePrismaDate(body.startDate),
          endDate: parsePrismaDate(body.endDate),
          type: AchievementType.EDUCATION,
        };

      case AchievementType.CERTIFICATION:
        return {
          name: body.name,
          organization: body.organization,
          description: body.description,
          isCurrent: body.isCurrent,
          startDate: parsePrismaDate(body.startDate),
          endDate: parsePrismaDate(body.endDate),
          type: AchievementType.CERTIFICATION,
        };
      default:
        throw new ActionFailedException(ActionFailed.AUTH_ACHIEVEMENT_INVALID_TYPE);
    }
  }
}

import { AchievementType, Prisma } from '@prisma/client';
import { IsEnum, IsOptional, IsString, MaxLength, ValidateIf } from 'class-validator';
import { ActionFailed, ActionFailedException } from 'src/shared/exceptions/action-failed.exception';
import { parsePrismaDate } from 'src/shared/parsers/datetime.parse';
import { NameValidator } from 'src/shared/request-validator/account.validator';
import { BooleanValidator } from 'src/shared/request-validator/boolean.request-validator';
import { DateMonthYearCompare } from 'src/shared/request-validator/month-year-compare.request-validator';
import { OnlyDate } from 'src/shared/request-validator/only-date.request-validator';

export class AuthAchievementREQ {
  @NameValidator()
  @ValidateIf((o) => o.achievementType === AchievementType.CERTIFICATION)
  name: string;

  @IsString()
  @MaxLength(255)
  organization: string; // Can be company or institution or certification body

  @IsEnum(AchievementType)
  achievementType: AchievementType;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  description?: string;

  @BooleanValidator()
  @IsOptional()
  isCurrent?: boolean = false;

  @IsString()
  @MaxLength(255)
  @ValidateIf((o) => o.achievementType === AchievementType.EXPERIENCE)
  position: string; // For experience

  @IsString()
  @MaxLength(255)
  @ValidateIf((o) => o.achievementType === AchievementType.EDUCATION)
  major: string; // For education

  @OnlyDate()
  startDate: string;

  @OnlyDate()
  @DateMonthYearCompare({ startField: 'startDate' })
  @ValidateIf((o) => !o.isCurrent)
  endDate: string;

  static ToCreateByAchievementType(body: AuthAchievementREQ, accountId: number): Prisma.ProfileAchievementCreateManyInput {
    const endDate = body.isCurrent ? null : parsePrismaDate(body.endDate);

    switch (body.achievementType) {
      case AchievementType.EXPERIENCE:
        return {
          accountId,
          organization: body.organization,
          description: body.description,
          position: body.position,
          isCurrent: body.isCurrent,
          startDate: parsePrismaDate(body.startDate),
          endDate: endDate,
          type: AchievementType.EXPERIENCE,
        };
      case AchievementType.EDUCATION:
        return {
          accountId,
          organization: body.organization,
          description: body.description,
          major: body.major,
          isCurrent: body.isCurrent,
          startDate: parsePrismaDate(body.startDate),
          endDate: endDate,
          type: AchievementType.EDUCATION,
        };

      case AchievementType.CERTIFICATION:
        return {
          accountId,
          name: body.name,
          organization: body.organization,
          description: body.description,
          isCurrent: body.isCurrent,
          startDate: parsePrismaDate(body.startDate),
          endDate: endDate,
          type: AchievementType.CERTIFICATION,
        };
      default:
        throw new ActionFailedException(ActionFailed.AUTH_ACHIEVEMENT_INVALID_TYPE);
    }
  }
}

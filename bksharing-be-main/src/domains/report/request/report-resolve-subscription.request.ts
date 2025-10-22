import { AccountSuspensionType, CourseSuspensionType } from '@prisma/client';
import { IsEnum, IsString, ValidateIf } from 'class-validator';
import { BooleanValidator } from 'src/shared/request-validator/boolean.request-validator';
import { ReportResolveBaseREQ } from './report-resolve-base.request';

export class ReportResolveSubscriptionREQ extends ReportResolveBaseREQ {
  @BooleanValidator()
  isSuspended: boolean = false;

  @IsString()
  @ValidateIf((o) => o.isSuspended)
  suspensionType: 'COURSE' | 'ACCOUNT';

  @IsEnum(CourseSuspensionType)
  @ValidateIf((o) => o.isSuspended && o.suspensionType === 'COURSE')
  coursePunishmentType: CourseSuspensionType;

  @IsEnum(AccountSuspensionType)
  @ValidateIf((o) => o.isSuspended && o.suspensionType === 'ACCOUNT')
  accountPunishmentType: AccountSuspensionType;
}

import { ReportType } from '@prisma/client';
import { IsEnum, MaxLength } from 'class-validator';
import { IdValidator } from 'src/shared/request-validator/id.validator';
import { ReportCreateInterface } from '../shared/interface';

export class ReportClientSubscriptionCreateREQ implements ReportCreateInterface {
  @IdValidator()
  subscriptionId: number;

  @IsEnum(ReportType)
  type: ReportType;

  @MaxLength(1000)
  description: string;
}

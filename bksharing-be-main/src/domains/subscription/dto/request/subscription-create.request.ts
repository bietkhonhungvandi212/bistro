import { IsOptional, IsString, MaxLength } from 'class-validator';
import { IdValidator } from 'src/shared/request-validator/id.validator';
import { OnlyDate } from 'src/shared/request-validator/only-date.request-validator';

export class SubscriptionCreateREQ {
  @OnlyDate()
  date: string;

  @IdValidator()
  mentorScheduleId: number;

  @IsString()
  @MaxLength(500)
  message: string;

  @IsString()
  @IsOptional()
  ipAddr: string;
}

import { SubscriptionStatus } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class SubscriptionClientListREQ {
  @IsEnum(SubscriptionStatus)
  @IsOptional()
  status?: SubscriptionStatus;
}

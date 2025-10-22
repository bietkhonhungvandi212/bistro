import { IsOptional, IsString } from 'class-validator';

export class SubscriptionPaymentCreateREQ {
  @IsString()
  message: string;

  @IsString()
  @IsOptional()
  ipAddr?: string;
}

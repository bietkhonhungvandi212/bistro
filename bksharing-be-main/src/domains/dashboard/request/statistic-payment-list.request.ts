import { PaymentStatus } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';
import { StatisticPaymentStatus } from 'src/shared/constants/dashboard.constant';
import { StatisticBaseListREQ } from './statistic-base-list.request';

export class StatisticPaymentListREQ extends StatisticBaseListREQ {
  @IsEnum(StatisticPaymentStatus)
  @IsOptional()
  status?: PaymentStatus;
}

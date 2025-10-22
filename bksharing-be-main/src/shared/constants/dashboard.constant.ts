import { PaymentStatus, SubscriptionStatus } from '@prisma/client';

export const StatisticSubsriptionStatus: SubscriptionStatus[] = [
  SubscriptionStatus.ACTIVE,
  SubscriptionStatus.EXPIRED,
  SubscriptionStatus.CANCELED,
];

export const StatisticPaymentStatus: PaymentStatus[] = [PaymentStatus.DONE, PaymentStatus.EXPIRED, PaymentStatus.CANCELED];

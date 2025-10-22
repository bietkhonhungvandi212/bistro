import { SubscriptionStatus } from '@prisma/client';

export const SUBSCRIPTION_NOT_CANCELED_STATUS: SubscriptionStatus[] = [
  SubscriptionStatus.CANCELED,
  SubscriptionStatus.REJECTED,
  SubscriptionStatus.EXPIRED,
  SubscriptionStatus.ENDED,
];

export const SUBSCRIPTION_ACTIVE_STATUS: SubscriptionStatus[] = [
  SubscriptionStatus.ACTIVE,
  SubscriptionStatus.PENDING,
  SubscriptionStatus.ACCEPTED,
];

export const STATUS_COMBINATION_FOR_SUBSCRIPTION: SubscriptionStatus[] = [SubscriptionStatus.ACTIVE, SubscriptionStatus.ENDED];

export const SUBSCRIPTION_STATUS_CANCEL_CALL_AUDIO: SubscriptionStatus[] = [
  SubscriptionStatus.ACCEPTED,
  SubscriptionStatus.ACTIVE,
];

// 3 days
// export const MIN_NEW_SUBSCRIPTION_DURATION = 60 * 60 * 24 * 3 * 1000;
export const MIN_NEW_SUBSCRIPTION_DURATION = 0;

// 2 days
export const EXPIRED_PENDING_SUBSCRIPTION = 60 * 60 * 24 * 2 * 1000;

// 1 days
// export const EXPIRED_SUBSCRIPTION_AFTER_APPROVED = 60 * 60 * 24 * 1000;
export const EXPIRED_SUBSCRIPTION_AFTER_APPROVED = 60 * 60 * 24 * 1000;

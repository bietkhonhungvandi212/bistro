import { SubscriptionStatus } from '@prisma/client';
import { IS_ACTIVE_NESTED } from 'src/shared/constants/prisma.constant';

export class StatisticCourseListHelper {
  static toGetTopCoursesByRate(accountId: number) {
    return {
      where: {
        creatorId: accountId,
        Subscriptions: { some: { status: SubscriptionStatus.ENDED, Feedback: { isNot: null }, ...IS_ACTIVE_NESTED } },
      },
      select: {
        id: true,
        name: true,
        Subscriptions: {
          where: { status: SubscriptionStatus.ENDED, Feedback: { isNot: null }, ...IS_ACTIVE_NESTED },
          select: { id: true, Feedback: { select: { courseRating: true } } },
        },
        _count: {
          select: {
            Subscriptions: { where: { status: SubscriptionStatus.ENDED, Feedback: { isNot: null }, ...IS_ACTIVE_NESTED } },
          },
        },
      },
    };
  }
}

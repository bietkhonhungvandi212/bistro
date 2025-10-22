import { Course, CourseStatus, Payment, Prisma, Subscription, SubscriptionStatus } from '@prisma/client';
import { filterByDateRange } from 'src/shared/helpers/date-range.helper';
import { parseDecimalNumber } from 'src/shared/parsers/common.parser';
import { StatisticOverviewListREQ } from '../request/statistic-overview-list.request';
import {
  StatisticCourseOverviewRESP,
  StatisticRevenueOverviewRESP,
  StatisticSubscriptionOverviewRESP,
} from '../response/statistic-overview-list.response';

export class StatisticOverviewClientListHelper {
  static toCountConditionQuery(query: StatisticOverviewListREQ) {
    const filterDateRange = filterByDateRange(query.dateRange);

    return { ...filterDateRange };
  }

  static toFindManyCourse(mentorAccountId: number, query: StatisticOverviewListREQ): Prisma.CourseFindManyArgs {
    const condition = this.toCountConditionQuery(query);

    return {
      where: { ...condition, creatorId: mentorAccountId },
      select: { status: true },
    };
  }

  static toFindManySubscription(mentorAccountId: number, query: StatisticOverviewListREQ): Prisma.SubscriptionFindManyArgs {
    const condition = this.toCountConditionQuery(query);

    return {
      where: { ...condition, Course: { creatorId: mentorAccountId } },
      select: { status: true },
    };
  }

  static toFindManyPayment(mentorAccountId: number, query: StatisticOverviewListREQ): Prisma.PaymentFindManyArgs {
    const condition = this.toCountConditionQuery(query);

    return {
      where: { ...condition, Subscription: { Course: { creatorId: mentorAccountId } } },
      select: { status: true, price: true, refundedPrice: true },
    };
  }

  static getCourseOverview(courses: Course[]): StatisticCourseOverviewRESP {
    const courseOverview: StatisticCourseOverviewRESP = {
      approvedCourse: 0,
      pendingCourse: 0,
      suspendedCourse: 0,
    };

    courses.forEach((course) => {
      if (course.status === CourseStatus.APPROVED) {
        courseOverview.approvedCourse++;
      } else if (course.status === CourseStatus.PENDING) {
        courseOverview.pendingCourse++;
      } else if (course.status === CourseStatus.SUSPENDED) {
        courseOverview.suspendedCourse++;
      }
    });

    return courseOverview;
  }

  static getSubscriptionOverview(subscriptions: Subscription[]): StatisticSubscriptionOverviewRESP {
    const subscriptionOverview: StatisticSubscriptionOverviewRESP = {
      activeSubscription: 0,
      pendingSubscription: 0,
      expiredSubscription: 0,
      cancelledSubscription: 0,
    };

    subscriptions.forEach((subscription) => {
      if (subscription.status === SubscriptionStatus.ACTIVE) {
        subscriptionOverview.activeSubscription++;
      } else if (subscription.status === SubscriptionStatus.PENDING) {
        subscriptionOverview.pendingSubscription++;
      } else if (subscription.status === SubscriptionStatus.EXPIRED) {
        subscriptionOverview.expiredSubscription++;
      } else if (subscription.status === SubscriptionStatus.CANCELED) {
        subscriptionOverview.cancelledSubscription++;
      }
    });

    return subscriptionOverview;
  }

  static getPaymentOverview(payments: Payment[]): StatisticRevenueOverviewRESP {
    const paymentOverview: StatisticRevenueOverviewRESP = {
      totalRevenue: 0,
      refundAmount: 0,
    };

    return payments.reduce((acc, payment) => {
      const revenue = parseDecimalNumber(payment.price) - parseDecimalNumber(payment.refundedPrice ?? 0);
      const refundAmount = parseDecimalNumber(payment.refundedPrice);

      return { totalRevenue: acc.totalRevenue + revenue, refundAmount: acc.refundAmount + refundAmount };
    }, paymentOverview);
  }
}

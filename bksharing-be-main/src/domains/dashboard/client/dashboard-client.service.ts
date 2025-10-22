import { Injectable, Logger } from '@nestjs/common';
import { SubscriptionStatus } from '@prisma/client';
import { AccountService } from 'src/domains/accounts/account.service';
import { AccountRESP } from 'src/domains/accounts/response/account.response';
import { AuthUserDTO } from 'src/domains/auth/dto/auth-user.dto';
import { SubscriptionListRESP } from 'src/domains/subscription/dto/response/subscription-list.response';
import { SubscriptionGetPlayload } from 'src/domains/subscription/shared/types';
import { TransactionHost } from 'src/services/prisma/transactions/transaction-host';
import { IS_ACTIVE_NESTED } from 'src/shared/constants/prisma.constant';
import { getDiffDaysOfDateRange } from 'src/shared/helpers/date-range.helper';
import { parseDecimalNumber } from 'src/shared/parsers/common.parser';
import { getMillisecondsFromCurrentDate } from 'src/shared/parsers/datetime.parse';
import { orNullWithCondition } from 'src/shared/parsers/io.parser';
import { StatisticOverviewClientListHelper } from '../helper/statistic-overview-client-list.helper';
import { StatisticPaymentListHelper } from '../helper/statistic-payment-list.helper';
import { StatisticSubscriptionListHelper } from '../helper/statistic-subscription-list.helper';
import { StatisticCourseListHelper } from '../request/statistic-course-list.request';
import { StatisticOverviewListREQ } from '../request/statistic-overview-list.request';
import { StatisticPaymentListREQ } from '../request/statistic-payment-list.request';
import { StatisticSubscriptionListREQ } from '../request/statistic-subscription-list.request';
import { StatisticTopCourseListREQ } from '../request/statistic-top-course-list.request';
import { StatisticOverviewClientListRESP } from '../response/statistic-overview-list.response';
import { StatisticPaymentListRESP } from '../response/statistic-payment-list.response';
import { StatisticSubscriptionListRESP, TopCourseType } from '../shared/types';

@Injectable()
export class DashboardClientService {
  private readonly logger = new Logger(DashboardClientService.name);
  constructor(
    private readonly transactionHost: TransactionHost,
    private readonly accountService: AccountService,
  ) {}

  async getOverviewStatistic(user: AuthUserDTO, query: StatisticOverviewListREQ): Promise<StatisticOverviewClientListRESP> {
    const courses = await this.transactionHost.tx.course.findMany(
      StatisticOverviewClientListHelper.toFindManyCourse(user.accountId, query),
    );
    const subscriptions = await this.transactionHost.tx.subscription.findMany(
      StatisticOverviewClientListHelper.toFindManySubscription(user.accountId, query),
    );
    const revenue = await this.transactionHost.tx.payment.findMany(
      StatisticOverviewClientListHelper.toFindManyPayment(user.accountId, query),
    );

    return {
      courseOverview: StatisticOverviewClientListHelper.getCourseOverview(courses),
      subscriptionOverview: StatisticOverviewClientListHelper.getSubscriptionOverview(subscriptions),
      revenueOverview: StatisticOverviewClientListHelper.getPaymentOverview(revenue),
    };
  }

  async getPaymentStatistic(user: AuthUserDTO, query: StatisticPaymentListREQ): Promise<StatisticPaymentListRESP[]> {
    const diffDays = getDiffDaysOfDateRange(query.dateRange);
    const numbers = Array.from({ length: diffDays + 1 }, (_, i) => i);
    const result = [];
    // Iterate over the numbers using for...of
    for (const number of numbers) {
      const beginDate = getMillisecondsFromCurrentDate({ days: number, fromBeginning: true });
      const endDate = getMillisecondsFromCurrentDate({ days: number, fromEnding: true });

      const paymentAggre = await this.transactionHost.tx.payment.aggregate(
        StatisticPaymentListHelper.toAggregateByAccountId(user.accountId, query, beginDate, endDate),
      );
      const noOfPayments = await this.transactionHost.tx.payment.count({
        where: {
          ...StatisticPaymentListHelper.toQueryPaymentCondition(query, beginDate, endDate),
          Subscription: { Course: { creatorId: user.accountId } },
        },
      });

      const value: StatisticPaymentListRESP = { totalAmount: parseDecimalNumber(paymentAggre._sum.price), noOfPayments };
      const date = getMillisecondsFromCurrentDate({ days: number });
      result.push({ [String(date)]: value });
    }

    return result;
  }

  async listSubscription(user: AuthUserDTO, query: StatisticSubscriptionListREQ): Promise<StatisticSubscriptionListRESP[]> {
    const subscriptions = await this.transactionHost.tx.subscription.findMany({
      ...StatisticSubscriptionListHelper.toFindMany(query),
      where: { Course: { creatorId: user.accountId } },
    });

    return Promise.all(
      subscriptions.map(async (subscription: SubscriptionGetPlayload) => {
        const studentInfo = await this.accountService.getMe(subscription.Account.id);

        return SubscriptionListRESP.fromEntity(
          subscription,
          AccountRESP.fromEntity(
            {
              ...studentInfo.account,
              dob: String(studentInfo.account.dob),
            },
            studentInfo.thumbnail,
          ),
          orNullWithCondition(!!subscription.AudioRoom, {
            status: subscription.AudioRoom?.status,
            cid: subscription.AudioRoom?.cid,
          }),
        );
      }),
    );
  }

  async getTopCourses(user: AuthUserDTO, query: StatisticTopCourseListREQ) {
    if (query.topCourseType === TopCourseType.TOP_RATE) {
      const courses = await this.transactionHost.tx.course.findMany(
        StatisticCourseListHelper.toGetTopCoursesByRate(user.accountId),
      );

      this.logger.log('🚀 ~ DashboardClientService ~ getTopCourses ~ subscriptions:', courses);

      return courses
        .map((course) => {
          const courseRating =
            course.Subscriptions.map((sub) => sub.Feedback.courseRating).reduce((a, b) => a + b, 0) / course._count.Subscriptions;

          return {
            id: course.id,
            name: course.name,
            rate: courseRating,
          };
        })
        .sort((a, b) => b.rate - a.rate)
        .slice(0, 6);
    }

    const courses = await this.transactionHost.tx.course.findMany({
      where: { creatorId: user.accountId },
      select: {
        id: true,
        name: true,
        _count: {
          select: { Subscriptions: { where: { status: SubscriptionStatus.ENDED, ...IS_ACTIVE_NESTED } } },
        },
      },
    });

    this.logger.log('🚀 ~ DashboardClientService ~ getTopCourses ~ subscriptions:', courses);

    return courses
      .map((course) => {
        return {
          id: course.id,
          name: course.name,
          noOfSubscription: course._count.Subscriptions,
        };
      })
      .sort((a, b) => b.noOfSubscription - a.noOfSubscription)
      .slice(0, 6);
  }
}

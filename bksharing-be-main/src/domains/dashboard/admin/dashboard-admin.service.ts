import { Injectable, Logger } from '@nestjs/common';
import { AccountService } from 'src/domains/accounts/account.service';
import { AccountRESP } from 'src/domains/accounts/response/account.response';
import { MentorClientService } from 'src/domains/mentor/client/mentor-client.service';
import { StudentGetPayload } from 'src/domains/student/shared/types';
import { SubscriptionListRESP } from 'src/domains/subscription/dto/response/subscription-list.response';
import { SubscriptionGetPlayload } from 'src/domains/subscription/shared/types';
import { TransactionHost } from 'src/services/prisma/transactions/transaction-host';
import { getDiffDaysOfDateRange } from 'src/shared/helpers/date-range.helper';
import { parseDecimalNumber } from 'src/shared/parsers/common.parser';
import { getMillisecondsFromCurrentDate } from 'src/shared/parsers/datetime.parse';
import { orNullWithCondition } from 'src/shared/parsers/io.parser';
import { StatisticOverviewAdminListHelper } from '../helper/statistic-overview-admin-list.helper';
import { StatisticPaymentListHelper } from '../helper/statistic-payment-list.helper';
import { StatisticSubscriptionListHelper } from '../helper/statistic-subscription-list.helper';
import { StatisticOverviewListREQ } from '../request/statistic-overview-list.request';
import { StatisticPaymentListREQ } from '../request/statistic-payment-list.request';
import { StatisticSubscriptionListREQ } from '../request/statistic-subscription-list.request';
import { StatisticOverviewListRESP } from '../response/statistic-overview-list.response';
import { StatisticPaymentListRESP } from '../response/statistic-payment-list.response';
import { StatisticSubscriptionListRESP } from '../shared/types';

@Injectable()
export class DashboardAdminService {
  private readonly logger = new Logger(DashboardAdminService.name);
  constructor(
    private readonly transactionHost: TransactionHost,
    private readonly accountService: AccountService,
    private readonly mentorClientService: MentorClientService,
  ) {}

  async getOverviewStatistic(query: StatisticOverviewListREQ): Promise<StatisticOverviewListRESP> {
    const mentors = await this.transactionHost.tx.mentor.findMany(StatisticOverviewAdminListHelper.toFindManyMentor(query));
    const students = await this.transactionHost.tx.student.findMany(StatisticOverviewAdminListHelper.toFindManyStudent(query));
    const courses = await this.transactionHost.tx.course.findMany(StatisticOverviewAdminListHelper.toFindManyCourse(query));
    const subscriptions = await this.transactionHost.tx.subscription.findMany(
      StatisticOverviewAdminListHelper.toFindManySubscription(query),
    );
    const reports = await this.transactionHost.tx.report.findMany(StatisticOverviewAdminListHelper.toFindManyReport(query));
    const revenue = await this.transactionHost.tx.payment.findMany(StatisticOverviewAdminListHelper.toFindManyPayment(query));

    return {
      mentorOverview: StatisticOverviewAdminListHelper.getMentorOverview(mentors),
      courseOverview: StatisticOverviewAdminListHelper.getCourseOverview(courses),
      studentOverview: StatisticOverviewAdminListHelper.getStudentOverview(students as StudentGetPayload[]),
      subscriptionOverview: StatisticOverviewAdminListHelper.getSubscriptionOverview(subscriptions),
      reportOverview: StatisticOverviewAdminListHelper.getReportOverview(reports),
      revenueOverview: StatisticOverviewAdminListHelper.getPaymentOverview(revenue),
    };
  }

  async getPaymentStatistic(query: StatisticPaymentListREQ): Promise<StatisticPaymentListRESP[]> {
    const diffDays = getDiffDaysOfDateRange(query.dateRange);
    const numbers = Array.from({ length: diffDays + 1 }, (_, i) => i);
    const result = [];
    // Iterate over the numbers using for...of
    for (const number of numbers) {
      const beginDate = getMillisecondsFromCurrentDate({ days: number, fromBeginning: true });
      const endDate = getMillisecondsFromCurrentDate({ days: number, fromEnding: true });

      const paymentAggre = await this.transactionHost.tx.payment.aggregate(
        StatisticPaymentListHelper.toAggregate(query, beginDate, endDate),
      );
      const noOfPayments = await this.transactionHost.tx.payment.count({
        where: StatisticPaymentListHelper.toQueryPaymentCondition(query, beginDate, endDate),
      });

      const value: StatisticPaymentListRESP = { totalAmount: parseDecimalNumber(paymentAggre._sum.price), noOfPayments };
      const date = getMillisecondsFromCurrentDate({ days: number });
      result.push({ [String(date)]: value });
    }

    return result;
  }

  async listSubscription(query: StatisticSubscriptionListREQ): Promise<StatisticSubscriptionListRESP[]> {
    const subscriptions = await this.transactionHost.tx.subscription.findMany(StatisticSubscriptionListHelper.toFindMany(query));

    return Promise.all(
      subscriptions.map(async (subscription: SubscriptionGetPlayload) => {
        const studentInfo = await this.accountService.getMe(subscription.Account.id);

        const mentorData = await this.mentorClientService.getMentorByAccountId(subscription.Course.creatorId);

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
          {
            id: mentorData?.mentor.id,
            accountId: mentorData?.mentor.accountId,
            name: mentorData?.mentor.Account.name,
            thumbnail: mentorData?.thumbnail,
          },
        );
      }),
    );
  }
}

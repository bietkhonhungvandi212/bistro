import { Injectable, Logger } from '@nestjs/common';
import { AccountService } from 'src/domains/accounts/account.service';
import { AccountRESP } from 'src/domains/accounts/response/account.response';
import { AuthUserDTO } from 'src/domains/auth/dto/auth-user.dto';
import { FeedbackGetPayload } from 'src/domains/feedback/shared/type';
import { MentorClientService } from 'src/domains/mentor/client/mentor-client.service';
import { TransactionHost } from 'src/services/prisma/transactions/transaction-host';
import { STATUS_COMBINATION_FOR_SUBSCRIPTION } from 'src/shared/constants/subscription.constant';
import { ActionFailed, ActionFailedException } from 'src/shared/exceptions/action-failed.exception';
import { parseDecimalNumber, parseEpoch } from 'src/shared/parsers/common.parser';
import { SubscriptionAdminListREQ } from '../dto/request/subscription-admin-list.request';
import { SubscriptionClientListREQ } from '../dto/request/subscription-client-list-request';
import { SubscriptionAdminListRESP } from '../dto/response/subscription-admin-list.response';
import { SubscriptionCombinedDetailRESP, SubscriptionFeedbackRESP } from '../dto/response/subscription-detail.response';
import { SubscriptionCombinedListRESP } from '../dto/response/subscription-list.response';
import { SubscriptionDetailHelper } from '../helper/subscription-detail.helper';
import { SubscriptionListHelper } from '../helper/subscription-list.helper';
import { SubscriptionGetPlayload, SubscriptionReportRESP } from '../shared/types';

@Injectable()
export class SubscriptionAdminService {
  private readonly logger = new Logger(SubscriptionAdminService.name);
  constructor(
    private readonly transactionHost: TransactionHost,
    // private readonly paymentClientService: PaymentClientService,
    private readonly mentorClientService: MentorClientService,
    private readonly accountService: AccountService,
  ) {}

  async listSubscription(query: SubscriptionAdminListREQ) {
    const subscriptions = await this.transactionHost.tx.subscription.findMany(
      SubscriptionListHelper.toFindManyWithCondition(query),
    );

    const count = await this.transactionHost.tx.subscription.count({
      where: SubscriptionListHelper.toFilterByCondition(query),
    });

    const subscriptionDtos = await Promise.all(
      subscriptions.map(async (subscription: SubscriptionGetPlayload) => {
        const studentInfo = await this.accountService.getMe(subscription.Account.id);

        const mentorData = await this.mentorClientService.getMentorByAccountId(subscription.Course.creatorId);

        return SubscriptionAdminListRESP.fromEntity(
          subscription,
          AccountRESP.fromEntity(
            {
              ...studentInfo.account,
              dob: String(studentInfo.account.dob),
            },
            studentInfo.thumbnail,
          ),
          {
            id: mentorData?.mentor.id,
            accountId: mentorData?.mentor.accountId,
            name: mentorData?.mentor.Account.name,
            thumbnail: mentorData?.thumbnail,
          },
        );
      }),
    );

    return { subscriptionDtos, count };
  }

  /**
   * Get subscription details
   */
  async getSubscriptionDetail(subscriptionId: number) {
    const subscription = (await this.transactionHost.tx.subscription.findUniqueOrThrow(
      SubscriptionDetailHelper.toFindUnique(subscriptionId),
    )) as SubscriptionGetPlayload;

    const mentorData = await this.mentorClientService.getMentorByAccountId(subscription.Course.creatorId);
    const studentInfo = await this.accountService.getMe(subscription.Account.id);

    return { subscription, mentorData, studentInfo };
  }

  /*
   * List subscription by account
   * @param user: AuthUserDTO
   * @param query: SubscriptionClientListREQ
   */
  async listcombinedSubscriptionByMentorAccount(query: SubscriptionClientListREQ) {
    if (!STATUS_COMBINATION_FOR_SUBSCRIPTION.includes(query.status)) {
      throw new ActionFailedException(ActionFailed.SUBSCRIPTION_STATUS_NOT_ALLOW);
    }

    const subscriptions = await this.transactionHost.tx.subscription.findMany(
      SubscriptionListHelper.toFindManyCombination(query),
    );

    const combineMap = new Map<string, SubscriptionCombinedListRESP>();

    subscriptions.forEach((subscription: SubscriptionGetPlayload) => {
      const courseStartAt = parseEpoch(subscription.courseAccessStartAt);
      const courseId = subscription.Course?.id;
      const callId = subscription.AudioRoom?.id;
      const key = `${courseStartAt}_${courseId}_${callId}`;
      if (combineMap.has(key)) {
        combineMap.get(key).ids.push(subscription.id);
      } else {
        combineMap.set(key, {
          ids: [subscription.id],
          status: subscription.status,
          originalPrice: parseDecimalNumber(subscription.originalPrice),
          courseStartAt: parseEpoch(subscription.courseAccessStartAt),
          courseEndAt: parseEpoch(subscription.courseAccessEndAt),
          course: { id: subscription.Course.id, name: subscription.Course.name },
          audiCall: {
            status: subscription.AudioRoom?.status,
            cid: subscription.AudioRoom?.cid,
          },
        });
      }
    });

    return Array.from(combineMap.values());
  }

  /*
   * Get subscription combined detail
   * @param user: AuthUserDTO
   * @param subscriptionId: number
   *
   * API: get subscription combined detail
   */
  async getSubscriptionCombinedDetail(user: AuthUserDTO, subscriptionId: number) {
    const subscription = (await this.transactionHost.tx.subscription.findUniqueOrThrow(
      SubscriptionDetailHelper.toFindUniqueWithAccount(user, subscriptionId),
    )) as SubscriptionGetPlayload;

    const combinedSubscriptions = (await this.transactionHost.tx.subscription.findMany(
      SubscriptionListHelper.toFindManyCombinationWithAccountAndParams(user, {
        courseStartsAt: subscription.courseAccessStartAt,
        courseId: subscription.Course.id,
        callId: subscription.AudioRoom?.id,
      }),
    )) as SubscriptionGetPlayload[];

    this.logger.log(
      '🚀 ~ SubscriptionClientService ~ getSubscriptionCombinedDetail ~ combinedSubscriptions:',
      combinedSubscriptions,
    );

    const ids = [];
    const students: { info: AccountRESP; feedback: SubscriptionFeedbackRESP; report?: SubscriptionReportRESP }[] = [];
    const mentorData = await this.mentorClientService.getMentorByAccountId(subscription.Course.creatorId);
    for (const sub of combinedSubscriptions) {
      ids.push(sub.id);
      const studentInfo = await this.accountService.getMe(sub.Account.id);
      const feedback = (await this.transactionHost.tx.feedback.findFirst({
        where: { subscriptionId: sub.id, reviewerId: sub.Account.id },
        select: {
          id: true,
          reviewerId: true,
          courseRating: true,
          mentorRating: true,
          courseReview: true,
          mentorReview: true,
        },
      })) as FeedbackGetPayload;

      students.push({
        info: AccountRESP.fromEntity(
          {
            ...studentInfo.account,
            dob: String(studentInfo.account.dob),
          },
          studentInfo.thumbnail,
        ),
        feedback: !!feedback ? SubscriptionFeedbackRESP.fromEntity(feedback) : null,
        report: !!sub.Report
          ? {
              id: sub.Report.id,
              type: sub.Report.type,
              description: sub.Report.description,
              status: sub.Report.status,
              resolution: sub.Report.resolution,
            }
          : null,
      });
    }

    return SubscriptionCombinedDetailRESP.fromEntity(subscription, mentorData.mentor, ids, students, mentorData.thumbnail);
  }
}

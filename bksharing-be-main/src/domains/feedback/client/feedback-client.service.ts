import { Injectable, Logger } from '@nestjs/common';
import { NotificationRelationType, NotificationType } from '@prisma/client';
import { AccountService } from 'src/domains/accounts/account.service';
import { NotificationHelper } from 'src/domains/notification/helper/notification-common.helper';
import { NotificationAppHandlerPayload, NotificationChannel } from 'src/domains/notification/shared/types';
import { EventEmitterService } from 'src/services/event-emitter/event-emitter.service';
import { TransactionHost } from 'src/services/prisma/transactions/transaction-host';
import { Transactional } from 'src/services/prisma/transactions/transactional.decorator';
import { COMMON_CONSTANT } from 'src/shared/constants/common.constant';
import { TRANSACTION_TIMEOUT } from 'src/shared/constants/prisma.constant';
import { ActionFailed, ActionFailedException } from 'src/shared/exceptions/action-failed.exception';
import { runFunctionWithCondition } from 'src/shared/helpers/common.helper';
import { FeedbackCreateHelper } from '../helper/feedback-create.helper';
import { FeedbackListHelper } from '../helper/feedback-list.helper';
import { FeedbackUpdateHelper } from '../helper/feedback-update.helper';
import { FeedbackCreateREQ } from '../request/feedback-create.request';
import { FeedbackListREQ } from '../request/feedback-list.request';
import { FeedbackUpdateREQ } from '../request/feedback-update.request';
import { FeedbackGetPayload } from '../shared/type';

@Injectable()
export class FeedbackClientService {
  private readonly logger: Logger = new Logger(FeedbackClientService.name);
  constructor(
    private readonly transactionHost: TransactionHost,
    private readonly accountSevice: AccountService,
    private readonly eventEmitterService: EventEmitterService,
  ) {}

  async list(query: FeedbackListREQ) {
    const feedbacks = await this.transactionHost.tx.feedback.findMany(FeedbackListHelper.toFindMany(query));
    const count = await this.transactionHost.tx.feedback.count({ where: FeedbackListHelper.toQueryCondition(query) });

    const dtos = await Promise.all(
      feedbacks.map(async (feedback: FeedbackGetPayload) => {
        const reviewer = await this.accountSevice.getMe(feedback.reviewerId);

        return FeedbackListHelper.fromEntity(feedback, {
          id: reviewer.account.id,
          name: reviewer.account.name,
          thumbnail: reviewer.thumbnail,
        });
      }),
    );

    return { dtos, count };
  }

  async listFeedbackByMentorId(mentorId: number) {
    const mentor = await this.transactionHost.tx.mentor.findUniqueOrThrow({
      where: { id: mentorId },
      select: { accountId: true },
    });

    const feedbacks = await this.transactionHost.tx.feedback.findMany(FeedbackListHelper.findManyByAccountId(mentor.accountId));
    const count = await this.transactionHost.tx.feedback.count({
      where: { Subscription: { Course: { Creator: { id: mentor.accountId } } } },
    });

    const dtos = await Promise.all(
      feedbacks.map(async (feedback: FeedbackGetPayload) => {
        const reviewer = await this.accountSevice.getMe(feedback.reviewerId);

        return FeedbackListHelper.fromEntity(feedback, {
          id: reviewer.account.id,
          name: reviewer.account.name,
          thumbnail: reviewer.thumbnail,
        });
      }),
    );

    return { dtos, count };
  }

  @Transactional(TRANSACTION_TIMEOUT)
  async create(reviewerId: number, body: FeedbackCreateREQ) {
    const feedback = await this.findBySubscriptionId(body.subscriptionId);
    if (feedback) throw new ActionFailedException(ActionFailed.FEEDBACK_ALREADY_EXISTS);

    const subscription = await this.transactionHost.tx.subscription.findUnique({
      where: { id: body.subscriptionId },
      select: { accountId: true, Course: { select: { id: true, creatorId: true, rates: true, noOfRates: true } } },
    });

    if (!subscription && subscription.accountId !== reviewerId)
      throw new ActionFailedException(ActionFailed.FEEDBACK_NOT_ENOUGH_PERMISSION);

    // Ensure the student is subscribed to the course or mentor
    const newFeedback = await this.transactionHost.tx.feedback.create(FeedbackCreateHelper.toCreate(reviewerId, body));

    if (newFeedback) {
      const mentor = await this.transactionHost.tx.mentor.findUniqueOrThrow({
        where: { accountId: subscription.Course?.creatorId },
        select: { rates: true, noOfRates: true },
      });

      const meanMentorRates = (mentor.rates + body.mentorRating) / (mentor.noOfRates + 1);
      try {
        await this.transactionHost.tx.mentor.update({
          where: { accountId: subscription.Course?.creatorId },
          data: {
            rates: { increment: body.mentorRating },
            noOfRates: { increment: COMMON_CONSTANT.MENTOR_NO_OF_RATE_INCREMENT },
            meanRates: meanMentorRates,
          },
        });
      } catch (error) {
        this.logger.error(error);
      }

      const meanCourseRates = (subscription.Course?.rates + body.courseRating) / (subscription.Course?.noOfRates + 1);
      await this.transactionHost.tx.course.update({
        where: { id: subscription.Course?.id },
        data: {
          rates: { increment: body.courseRating },
          noOfRates: { increment: COMMON_CONSTANT.COURSE_NO_OF_RATE_INCREMENT },
          meanRates: meanCourseRates,
        },
        select: { id: true },
      });
    }

    //Notification: send notification to mentor
    const subcription = await this.transactionHost.tx.subscription.findFirst({
      where: { id: body.subscriptionId },
      select: { Course: { select: { creatorId: true } } },
    });

    const payload = NotificationHelper.makeAppNotificationPayload(
      { id: newFeedback.id, type: NotificationRelationType.FEEDBACK },
      subcription.Course?.creatorId,
      NotificationType.FEEDBACK_CREATED,
    );

    runFunctionWithCondition(!!newFeedback, () => {
      this.eventEmitterService.emit<NotificationAppHandlerPayload>(NotificationChannel.APP, payload);
    });

    return newFeedback;
  }

  @Transactional(TRANSACTION_TIMEOUT)
  async update(reviewerId: number, feedbackId: number, body: FeedbackUpdateREQ) {
    const feedback = await this.transactionHost.tx.feedback.findFirst({
      where: { id: feedbackId },
      select: { id: true, reviewerId: true },
    });

    if (!feedback) throw new ActionFailedException(ActionFailed.FEEDBACK_NOT_FOUND);

    if (feedback.reviewerId !== reviewerId) throw new ActionFailedException(ActionFailed.FEEDBACK_NOT_BELONG_TO_REVIEWER);

    return this.transactionHost.tx.feedback.update(FeedbackUpdateHelper.toUpdate(feedback.id, body));
  }

  async findBySubscriptionId(subscriptionId: number) {
    const feedback = await this.transactionHost.tx.feedback.findFirst({
      where: { subscriptionId },
      select: { id: true, reviewerId: true },
    });

    return feedback;
  }

  @Transactional(TRANSACTION_TIMEOUT)
  async delete(reviewerId: number, feedbackId: number) {
    const feedback = await this.transactionHost.tx.feedback.findFirst({
      where: { id: feedbackId },
      select: { id: true, reviewerId: true, subscriptionId: true },
    });

    if (!feedback) throw new ActionFailedException(ActionFailed.FEEDBACK_NOT_FOUND);

    if (feedback.reviewerId !== reviewerId) throw new ActionFailedException(ActionFailed.FEEDBACK_NOT_BELONG_TO_REVIEWER);

    const subcription = await this.transactionHost.tx.subscription.findFirst({
      where: { id: feedback.subscriptionId },
      select: { Course: { select: { creatorId: true } } },
    });
    const deletedFeedback = this.transactionHost.tx.feedback.delete({ where: { id: feedbackId } });

    const payload = NotificationHelper.makeAppNotificationPayload(
      { id: feedback.id, type: NotificationRelationType.FEEDBACK },
      subcription.Course?.creatorId,
      NotificationType.FEEDBACK_DELETED,
    );

    this.eventEmitterService.emit<NotificationAppHandlerPayload>(NotificationChannel.APP, payload);

    return deletedFeedback;
  }

  async requestReviewModeration(feedbackId: number) {
    const feedback = await this.transactionHost.tx.feedback.findFirst({
      where: { id: feedbackId },
      select: { id: true, subscriptionId: true },
    });

    if (!feedback) throw new ActionFailedException(ActionFailed.FEEDBACK_NOT_FOUND);
  }
}

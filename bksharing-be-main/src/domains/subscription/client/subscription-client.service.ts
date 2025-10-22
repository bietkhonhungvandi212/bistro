import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import {
  AccountType,
  Course,
  CourseStatus,
  NotificationRelationType,
  NotificationType,
  PaymentStatus,
  ReportStatus,
  RoomStatus,
  SubscriptionStatus,
} from '@prisma/client';
import { isEmpty } from 'lodash';
import { AccountService } from 'src/domains/accounts/account.service';
import { AccountRESP } from 'src/domains/accounts/response/account.response';
import { AudioCallService } from 'src/domains/audio-call/audio-call.service';
import { AuthUserDTO } from 'src/domains/auth/dto/auth-user.dto';
import { FeedbackGetPayload } from 'src/domains/feedback/shared/type';
import { MentorClientService } from 'src/domains/mentor/client/mentor-client.service';
import { NotificationHelper } from 'src/domains/notification/helper/notification-common.helper';
import { NotificationAppHandlerPayload, NotificationChannel } from 'src/domains/notification/shared/types';
import { PaymentClientService } from 'src/domains/payment/client/payment-client.service';
import { EventEmitterService } from 'src/services/event-emitter/event-emitter.service';
import { TransactionHost } from 'src/services/prisma/transactions/transaction-host';
import { Transactional } from 'src/services/prisma/transactions/transactional.decorator';
import { DAY_OF_WEEK } from 'src/shared/constants/date.constant';
import { IS_ACTIVE_NESTED, TRANSACTION_TIMEOUT } from 'src/shared/constants/prisma.constant';
import {
  EXPIRED_PENDING_SUBSCRIPTION,
  EXPIRED_SUBSCRIPTION_AFTER_APPROVED,
  STATUS_COMBINATION_FOR_SUBSCRIPTION,
  SUBSCRIPTION_ACTIVE_STATUS,
  SUBSCRIPTION_NOT_CANCELED_STATUS,
  SUBSCRIPTION_STATUS_CANCEL_CALL_AUDIO,
} from 'src/shared/constants/subscription.constant';
import { ActionFailed, ActionFailedException } from 'src/shared/exceptions/action-failed.exception';
import { nowEpoch, runFunctionWithCondition } from 'src/shared/helpers/common.helper';
import { parseDecimalNumber, parseEpoch } from 'src/shared/parsers/common.parser';
import { getDayOfWeek, parseDateToHyphen, parseEpochToDate } from 'src/shared/parsers/datetime.parse';
import { orNullWithCondition } from 'src/shared/parsers/io.parser';
import { SubscriptionClientListREQ } from '../dto/request/subscription-client-list-request';
import { SubscriptionCreateREQ } from '../dto/request/subscription-create.request';
import { SubscriptionMentorApproveREQ } from '../dto/request/subscription-mentor-approve';
import { SubscriptionPaymentCreateREQ } from '../dto/request/subscription-payment-create';
import { SubscriptionCombinedDetailRESP, SubscriptionFeedbackRESP } from '../dto/response/subscription-detail.response';
import { SubscriptionCombinedListRESP, SubscriptionListRESP } from '../dto/response/subscription-list.response';
import { SubscriptionCreateHelper } from '../helper/subcription-create.helper';
import { SubscriptionApproveHelper } from '../helper/subscription-approve.helper';
import { parseBookingDateTimeToEpoch } from '../helper/subscription-common.helper';
import { SubscriptionDetailHelper } from '../helper/subscription-detail.helper';
import { SubscriptionListHelper } from '../helper/subscription-list.helper';
import { SubscriptionGetPlayload, SubscriptionReportRESP } from '../shared/types';

@Injectable()
export class SubscriptionClientService {
  private readonly logger = new Logger(SubscriptionClientService.name);
  constructor(
    private readonly transactionHost: TransactionHost,
    private readonly paymentClientService: PaymentClientService,
    private readonly mentorClientService: MentorClientService,
    private readonly accountService: AccountService,
    private readonly audioCallService: AudioCallService,
    private readonly eventEmitterService: EventEmitterService,
  ) {}

  @Cron('0 0 * * * *', {
    name: 'handle-expired-pending-subscription',
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  async handleExpiredSubscription() {
    const subscriptions = await this.transactionHost.tx.subscription.findMany({
      where: { status: SubscriptionStatus.PENDING },
      select: {
        mentorScheduleId: true,
        status: true,
        createdAt: true,
        id: true,
      },
    });

    if (isEmpty(subscriptions)) return;

    await Promise.all(
      subscriptions.map(async (subscription) => {
        const now = nowEpoch();
        const createdAt = parseEpoch(subscription.createdAt);

        if (now - createdAt > EXPIRED_PENDING_SUBSCRIPTION) {
          this.logger.warn(
            `🚀 ~ SubscriptionClientService ~ Cron ~ handleExpiredSubscription ~ subscription with ${subscription.id} was canceled at ${parseEpochToDate(nowEpoch())} because mentor not reponse after 2 days`,
          );

          const updatedSubscription = await this.transactionHost.tx.subscription.update({
            where: { id: subscription.id },
            data: { status: SubscriptionStatus.EXPIRED, canceledAt: nowEpoch() },
            select: { id: true, accountId: true, Course: { select: { creatorId: true } }, status: true },
          });

          for (const accountId of [updatedSubscription.accountId, updatedSubscription.Course.creatorId]) {
            const payload = NotificationHelper.makeAppNotificationPayload(
              { id: updatedSubscription.id, type: NotificationRelationType.SUBSCRIPTION },
              accountId,
              NotificationType.SUBSCRIPTION_EXPIRED,
            );
            runFunctionWithCondition(!!updatedSubscription, () => {
              this.eventEmitterService.emit<NotificationAppHandlerPayload>(NotificationChannel.APP, payload);
            });
          }
        }
      }),
    );
  }

  @Cron('0 0 * * * *', {
    name: 'handle-expired-paid-subscription',
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  async handleExpiredApprovedSubscription() {
    const subscriptions = await this.transactionHost.tx.subscription.findMany({
      where: { status: SubscriptionStatus.ACCEPTED },
      select: {
        mentorScheduleId: true,
        status: true,
        approvedAt: true,
        id: true,
      },
    });

    if (isEmpty(subscriptions)) return;

    await Promise.all(
      subscriptions.map(async (subscription) => {
        const now = nowEpoch();
        const approvedAt = parseEpoch(subscription.approvedAt);

        if (now - approvedAt > EXPIRED_SUBSCRIPTION_AFTER_APPROVED) {
          this.logger.warn(
            `🚀 ~ SubscriptionClientService ~ Cron ~ handleExpiredApprovedSubscription ~ subscription with ${subscription.id} was canceled at ${parseEpochToDate(nowEpoch())} because student not paid after 1 day`,
          );

          const updatedSubscription = await this.transactionHost.tx.subscription.update({
            where: { id: subscription.id },
            data: {
              status: SubscriptionStatus.EXPIRED,
              Payment: { update: { status: PaymentStatus.EXPIRED } },
              canceledAt: nowEpoch(),
            },
            select: { id: true, accountId: true, Course: { select: { creatorId: true } }, status: true },
          });

          for (const accountId of [updatedSubscription.accountId, updatedSubscription.Course.creatorId]) {
            const payload = NotificationHelper.makeAppNotificationPayload(
              { id: updatedSubscription.id, type: NotificationRelationType.SUBSCRIPTION },
              accountId,
              NotificationType.SUBSCRIPTION_EXPIRED,
            );
            runFunctionWithCondition(!!updatedSubscription, () => {
              this.eventEmitterService.emit<NotificationAppHandlerPayload>(NotificationChannel.APP, payload);
            });
          }
        }
      }),
    );
  }

  @Cron('0 0 0 * * *', {
    name: 'handle-suspended-course-subscription',
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  async handleSuspendedCourseSubscription() {
    const courses = await this.transactionHost.tx.course.findMany({
      where: { status: CourseStatus.SUSPENDED, ...IS_ACTIVE_NESTED },
      select: { id: true, status: true },
    });

    await Promise.all(
      courses.map(async (course) => {
        const subscriptions = await this.transactionHost.tx.subscription.findMany({
          where: { courseId: course.id, status: SubscriptionStatus.ACTIVE, ...IS_ACTIVE_NESTED },
          select: { id: true, audioRoomId: true, Payment: { select: { id: true } } },
        });

        for (const subscription of subscriptions) {
          await this.transactionHost.tx.subscription.update({
            where: { id: subscription.id },
            data: {
              status: SubscriptionStatus.CANCELED,
              canceledAt: nowEpoch(),
              AudioRoom: { update: { status: RoomStatus.FINISHED } },
              Payment: { update: { status: PaymentStatus.REFUNDED } },
            },
            select: { id: true },
          });

          //TODO: Refund money to student
        }
      }),
    );
  }

  /*
   * List subscription by account
   * @param user: AuthUserDTO
   * @param query: SubscriptionClientListREQ
   */
  async listcombinedSubscriptionByMentorAccount(user: AuthUserDTO, query: SubscriptionClientListREQ) {
    if (!STATUS_COMBINATION_FOR_SUBSCRIPTION.includes(query.status)) {
      throw new ActionFailedException(ActionFailed.SUBSCRIPTION_STATUS_NOT_ALLOW);
    }

    const subscriptions = await this.transactionHost.tx.subscription.findMany(
      SubscriptionListHelper.toFindManyCombinationWithAccount(user, query),
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
   * List subscription by account
   */
  async listSubscriptionByAccount(user: AuthUserDTO, query: SubscriptionClientListREQ) {
    // TODO: Uncomment this code when the feature is ready
    // if (STATUS_COMBINATION_FOR_SUBSCRIPTION.includes(query.status))
    //   throw new ActionFailedException(ActionFailed.SUBSCRIPTION_STATUS_NOT_ALLOW);

    const subscriptions = await this.transactionHost.tx.subscription.findMany(
      SubscriptionListHelper.toFindManyWithAccount(user, query),
    );

    return Promise.all(
      subscriptions.map(async (subscription: SubscriptionGetPlayload) => {
        const studentInfo = await this.accountService.getMe(subscription.Account.id);

        const mentorData =
          user.accountType !== AccountType.MENTOR
            ? await this.mentorClientService.getMentorByAccountId(subscription.Course.creatorId)
            : null;

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

  async listSubscriptionByMentorId(mentorId: number) {
    const { mentor } = await this.mentorClientService.detail(mentorId);

    const subscriptions = await this.transactionHost.tx.subscription.findMany({
      where: { Course: { creatorId: mentor.accountId }, status: { in: SUBSCRIPTION_ACTIVE_STATUS } },
      select: { id: true, courseAccessStartAt: true, courseAccessEndAt: true, status: true },
    });

    return subscriptions.map((subscription) => {
      return {
        id: subscription.id,
        status: subscription.status,
        courseAccessStartAt: parseEpoch(subscription.courseAccessStartAt),
        courseAccessEndAt: parseEpoch(subscription.courseAccessEndAt),
      };
    });
  }

  @Transactional(TRANSACTION_TIMEOUT)
  async create(user: AuthUserDTO, courseId: number, body: SubscriptionCreateREQ): Promise<any> {
    const course = (await this.transactionHost.tx.course.findUniqueOrThrow({
      where: { id: courseId },
      select: { id: true, startDate: true, endDate: true, price: true, litmitOfStudents: true, creatorId: true },
    })) as Course;

    const existedSubscriptions = (await this.transactionHost.tx.subscription.findMany(
      SubscriptionCreateHelper.toFindManyByAccountId(user.accountId),
    )) as SubscriptionGetPlayload[];

    // 1. Check for active subscription by the user for the same course
    const existedAccountSubscriptions = existedSubscriptions.filter((subscription) => subscription.Course.id === course.id);

    if (!isEmpty(existedAccountSubscriptions) && SUBSCRIPTION_ACTIVE_STATUS.includes(existedAccountSubscriptions[0]?.status)) {
      this.logger.error(`🚀 ~ SubscriptionClientService ~ create ~ there are same courses subscribed which are ACTIVE`);
      throw new ActionFailedException(ActionFailed.SUBSCRIPTION_FOR_THIS_COURSE_STILL_ACTIVE);
    } else if (!isEmpty(existedAccountSubscriptions)) {
      //TODO: Uncomment this code when the feature is ready
      // const now = nowEpoch();
      // const lastSubscriptionInActive =
      //   parseEpoch(existedAccountSubscriptions[0].rejectedAt) || parseEpoch(existedAccountSubscriptions[0].canceledAt);
      //
      // const isStillBanned = now - lastSubscriptionInActive > EXPIRED_PENDING_SUBSCRIPTION;
      // if (lastSubscriptionInActive && isStillBanned) {
      //   this.logger.log(
      //     `🚀 ~ SubscriptionClientService ~ create ~ the user with account id ${user.accountId} can not subscribe to this course with course id ${course.id}`,
      //   );
      //   throw new ActionFailedException(ActionFailed.SUBSRIPTION_NOT_ALLOW_NEXT_7_DAYS);
      // }
    }

    // 2. Check for mentor schedule conflicts
    // Check time of mentor schedule
    const schedule = await this.transactionHost.tx.mentorSchedule.findFirstOrThrow({
      where: { id: body.mentorScheduleId, Mentor: { Account: { id: course.creatorId } } },
    });

    // Check how many subscriptions are booked for this mentor's course at the same time and same date
    const conflictSchedule = await this.transactionHost.tx.subscription.findMany({
      where: {
        status: { in: SUBSCRIPTION_ACTIVE_STATUS },
        mentorScheduleId: body.mentorScheduleId,
        courseAccessStartAt: parseBookingDateTimeToEpoch(body.date, schedule.startTime),
      },
      select: { id: true },
    });

    // Check if schedule is already booked
    if (!isEmpty(conflictSchedule) && conflictSchedule.length >= course.litmitOfStudents) {
      this.logger.error(
        `🚀 ~ SubscriptionClientService ~ create ~ this course has reached the maximum number of subscriptions at the same time and date`,
      );

      throw new ActionFailedException(ActionFailed.SUBSCRIPTION_COURSE_REACHED_MAXIMUM);
    }

    //3. Check for overlapping subscriptions with other mentors
    const courseAccessStartAt = parseBookingDateTimeToEpoch(body.date, schedule.startTime);
    const isOverlapScheduleWithOtherMentor = existedSubscriptions.some((subscription) => {
      if (
        SUBSCRIPTION_ACTIVE_STATUS.includes(subscription.status) &&
        subscription.Course.creatorId !== course.creatorId &&
        Number(parseEpoch(subscription.courseAccessStartAt)) === courseAccessStartAt
      ) {
        this.logger.error(
          `🚀 ~ SubscriptionClientService ~ isNotMentorSubscriptionActive ~ This subscription has been scheduled overlap with the subscription id ${subscription.id} and the course id ${subscription.Course.id}`,
        );
        return true;
      }
    });

    if (isOverlapScheduleWithOtherMentor) {
      throw new ActionFailedException(ActionFailed.SUBSCRIPTION_ACTIVE_OVERLAP_SCHEDULE);
    }

    const parsedDate = parseDateToHyphen(body.date);
    const dayOfWeek = getDayOfWeek(parsedDate);
    this.logger.log(`🚀 ~ SubscriptionClientService ~ create ~ the date ${body.date} is ${DAY_OF_WEEK[dayOfWeek]}`);
    this.logger.log(`🚀 ~ SubscriptionClientService ~ create ~ the schedule day is ${schedule.dayOfWeek}`);

    if (schedule.dayOfWeek !== DAY_OF_WEEK[dayOfWeek]) {
      throw new ActionFailedException(
        ActionFailed.MENTOR_SCHEDULE_NOT_HAVE_SAME_DAY_OF_WEEK,
        `the schedule day is ${schedule.dayOfWeek} but you choose ${DAY_OF_WEEK[dayOfWeek]}`,
      );
    }

    const subscription = await this.transactionHost.tx.subscription.create(
      SubscriptionCreateHelper.toCreate(user, course, schedule, body),
    );

    //Notification: send notification to mentor
    const payload = NotificationHelper.makeAppNotificationPayload(
      { id: subscription.id, type: NotificationRelationType.SUBSCRIPTION },
      course.creatorId,
      NotificationType.SUBSCRIPTION_CREATED,
    );
    runFunctionWithCondition(!!subscription, () => {
      this.eventEmitterService.emit<NotificationAppHandlerPayload>(NotificationChannel.APP, payload);
    });

    return subscription;
  }

  @Transactional(TRANSACTION_TIMEOUT)
  async approve(courseCreator: AuthUserDTO, body: SubscriptionMentorApproveREQ) {
    await this.transactionHost.tx.subscription.findUniqueOrThrow({
      where: { id: body.subscriptionId, Course: { creatorId: courseCreator.accountId } },
      select: { id: true },
    });

    const updatedSubscription = await this.transactionHost.tx.subscription.update(
      SubscriptionApproveHelper.toApprove(body, courseCreator),
    );

    //Notification: send notification to student
    const payload = NotificationHelper.makeAppNotificationPayload(
      { id: updatedSubscription.id, type: NotificationRelationType.SUBSCRIPTION },
      updatedSubscription.accountId,
      body.isApproved ? NotificationType.SUBSCRIPTION_APPROVED : NotificationType.SUBSCRIPTION_REJECTED,
    );
    runFunctionWithCondition(!!updatedSubscription, () => {
      this.eventEmitterService.emit<NotificationAppHandlerPayload>(NotificationChannel.APP, payload);
    });

    return updatedSubscription.id;
  }

  @Transactional(TRANSACTION_TIMEOUT)
  async makePayment(user: AuthUserDTO, subscriptionId: number, body: SubscriptionPaymentCreateREQ) {
    const subscription = (await this.transactionHost.tx.subscription.findUniqueOrThrow({
      where: { id: subscriptionId },
      select: { originalPrice: true, status: true, accountId: true },
    })) as SubscriptionGetPlayload;

    if (subscription.status !== SubscriptionStatus.ACCEPTED)
      throw new ActionFailedException(
        ActionFailed.SUBSCRIPTION_NOT_MAKE_PAYMENT,
        `Subscription status is ${subscription.status}`,
      );

    if (subscription.accountId !== user.accountId) throw new ActionFailedException(ActionFailed.SUBSCRIPTION_NOT_BELONG_TO_USER);

    const { payment, url } = await this.paymentClientService.create(
      {
        subscriptionId: subscriptionId,
        amount: Number(subscription.originalPrice),
        description: body.message,
      },
      body.ipAddr,
    );

    return { payment, url };
  }

  async continue(user: AuthUserDTO, subscriptionId: number, body: SubscriptionPaymentCreateREQ) {
    const subscription = await this.transactionHost.tx.subscription.findUniqueOrThrow({
      where: { id: subscriptionId },
      select: { id: true, originalPrice: true, status: true, accountId: true, approvedAt: true },
    });

    if (subscription.accountId !== user.accountId) throw new ActionFailedException(ActionFailed.SUBSCRIPTION_NOT_BELONG_TO_USER);

    const now = nowEpoch();
    if (
      now - parseEpoch(subscription.approvedAt) > EXPIRED_SUBSCRIPTION_AFTER_APPROVED ||
      subscription.status === SubscriptionStatus.EXPIRED
    ) {
      this.logger.warn(
        `🚀 ~ PaymentClientService ~ verify ~ Subscription ${subscription.id} expired because not make payment after approved around 1 day`,
      );

      // throw new ActionFailedException(ActionFailed.SUBSCRIPTION_EXPIRED_AS_NOT_MAKE_PAYMENT);
    } else if (subscription.status !== SubscriptionStatus.ACCEPTED) {
      throw new ActionFailedException(ActionFailed.SUBSCRIPTION_NOT_AVAILABLE);
    }

    const { payment, url } = await this.paymentClientService.continue(
      {
        subscriptionId: subscriptionId,
        amount: Number(subscription.originalPrice),
        description: body.message,
      },
      body.ipAddr,
    );

    return { payment, url };
  }

  @Transactional(TRANSACTION_TIMEOUT)
  async cancel(user: AuthUserDTO, subscriptionId: number) {
    const subscription = await this.transactionHost.tx.subscription.findUniqueOrThrow({
      where: { id: subscriptionId },
      select: {
        status: true,
        accountId: true,
        mentorScheduleId: true,
        audioRoomId: true,
        Course: { select: { creatorId: true } },
      },
    });

    if (subscription.accountId !== user.accountId) throw new ActionFailedException(ActionFailed.SUBSCRIPTION_NOT_BELONG_TO_USER);

    if (SUBSCRIPTION_NOT_CANCELED_STATUS.includes(subscription.status)) {
      throw new ActionFailedException(
        ActionFailed.SUBSCRIPTION_NOT_CANCEL,
        `Subscription status in ${SUBSCRIPTION_NOT_CANCELED_STATUS} can not be canceled`,
      );
    }

    if (SUBSCRIPTION_STATUS_CANCEL_CALL_AUDIO.includes(subscription.status)) {
      await this.audioCallService.cancelCall(subscription.audioRoomId);
    }

    await this.transactionHost.tx.subscription.update({
      where: { id: subscriptionId },
      data: {
        status: subscription.status === SubscriptionStatus.ACTIVE ? SubscriptionStatus.ENDED : SubscriptionStatus.CANCELED,
        canceledAt: nowEpoch(),
      },
    });
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
    const students: { info: AccountRESP; report?: SubscriptionReportRESP; feedback?: SubscriptionFeedbackRESP }[] = [];
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
        report:
          !!sub.Report && sub.Report?.status === ReportStatus.RESOLVED
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

  /**
   * Get subscription details
   */
  async getSubscriptionDetailWithAccount(user: AuthUserDTO, subscriptionId: number) {
    const subscription = (await this.transactionHost.tx.subscription.findUniqueOrThrow(
      SubscriptionDetailHelper.toFindUniqueWithAccount(user, subscriptionId),
    )) as SubscriptionGetPlayload;

    const mentorData = await this.mentorClientService.getMentorByAccountId(subscription.Course.creatorId);
    const studentInfo = await this.accountService.getMe(subscription.Account.id);

    if (subscription.Account.id !== user.accountId && user.accountType === AccountType.STUDENT) {
      throw new ActionFailedException(ActionFailed.SUBSCRIPTION_NOT_BELONG_TO_USER);
    } else if (subscription.Course.creatorId !== user.accountId && user.accountType === AccountType.MENTOR) {
      throw new ActionFailedException(ActionFailed.COURSE_NOT_BELONG_TO_THIS_ACCOUNT);
    }

    return { subscription, mentorData, studentInfo };
  }

  async detail(user: AuthUserDTO, subscriptionId: number) {
    const subscription = (await this.transactionHost.tx.subscription.findUniqueOrThrow(
      SubscriptionDetailHelper.toFindUniqueWithAccount(user, subscriptionId),
    )) as SubscriptionGetPlayload;

    const mentorData = await this.mentorClientService.getMentorByAccountId(subscription.Course.creatorId);
    const studentInfo = await this.accountService.getMe(subscription.Account.id);

    return { subscription, mentorData, studentInfo };
  }
}

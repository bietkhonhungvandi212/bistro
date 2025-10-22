import { Injectable, Logger } from '@nestjs/common';
import {
  AccountStatus,
  AccountSuspensionType,
  AccountType,
  AudioRoomActivityHistory,
  CourseStatus,
  CourseSuspensionType,
  Feedback,
  NotificationRelationType,
  NotificationType,
  PaymentStatus,
  Report,
  ReportStatus,
  ReportType,
  RoomStatus,
  SubscriptionStatus,
} from '@prisma/client';
import { EventEmitterService } from 'src/services/event-emitter/event-emitter.service';
import { TransactionHost } from 'src/services/prisma/transactions/transaction-host';
import { Transactional } from 'src/services/prisma/transactions/transactional.decorator';
import {
  NOTIFICATION_SUSPENSION_ACCOUNT_MAPPER,
  NOTIFICATION_SUSPENSION_COURSE_MAPPER,
} from 'src/shared/constants/notification.constant';
import { TRANSACTION_TIMEOUT } from 'src/shared/constants/prisma.constant';
import { REPORT_FEEDBACK_TYPE, REPORT_SUBSCRIPTION_TYPE, ReportNotificationMap } from 'src/shared/constants/report.constant';
import { SUBSCRIPTION_ACTIVE_STATUS } from 'src/shared/constants/subscription.constant';
import { SortOrder } from 'src/shared/enums/query.enum';
import { ActionFailed, ActionFailedException } from 'src/shared/exceptions/action-failed.exception';
import { nowEpoch, runFunctionWithCondition } from 'src/shared/helpers/common.helper';
import { orNullWithCondition, orUndefinedWithCondition } from 'src/shared/parsers/io.parser';
import { AccountService } from '../accounts/account.service';
import { AccountRESP } from '../accounts/response/account.response';
import { AuthUserDTO } from '../auth/dto/auth-user.dto';
import { FeedbackClientService } from '../feedback/client/feedback-client.service';
import { FeedbackGetPayload, FeedbackRelation } from '../feedback/shared/type';
import { NotificationHelper } from '../notification/helper/notification-common.helper';
import { NotificationAppHandlerPayload, NotificationChannel } from '../notification/shared/types';
import { SubscriptionClientService } from '../subscription/client/subscription-client.service';
import { SubscriptionDetailRESP } from '../subscription/dto/response/subscription-detail.response';
import { SubscriptionGetPlayload } from '../subscription/shared/types';
import { ReportCreateHelper } from './helper/report-create.helper';
import { ReportDetailHelper } from './helper/report-detail.helper';
import { ReportListHelper } from './helper/report-list.helper';
import { ReportResolveHelper } from './helper/report-resolve.helper';
import { ReportClientFeedbackCreateREQ } from './request/report-client-feedback-create.request';
import { ReportClientSubscriptionCreateREQ } from './request/report-client-subscription-create.request';
import { ReportListREQ } from './request/report-list.request';
import { ReportResolveFeedbackREQ } from './request/report-resolve-feeback.request';
import { ReportResolveSubscriptionREQ } from './request/report-resolve-subscription.request';
import { ReportGetPayload } from './shared/type';

@Injectable()
export class ReportService {
  private readonly logger = new Logger(ReportService.name);
  constructor(
    private readonly transactionHost: TransactionHost,
    private readonly eventEmitterService: EventEmitterService,
    private readonly subscriptionService: SubscriptionClientService,
    private readonly feedbackService: FeedbackClientService,
    private readonly accountService: AccountService,
  ) {}

  async list(user: AuthUserDTO, query: ReportListREQ) {
    const count = await this.transactionHost.tx.report.count({ where: ReportListHelper.toQueryCondition(user, query) });
    const reports = await this.transactionHost.tx.report.findMany(ReportListHelper.toFindMany(user, query));

    const dto = reports.map(ReportListHelper.fromEntity);

    return { data: dto, count };
  }

  async detail(user: AuthUserDTO, reportId: number) {
    let report: ReportGetPayload;
    try {
      report = (await this.transactionHost.tx.report.findUniqueOrThrow(
        ReportDetailHelper.toFindUnique(reportId),
      )) as ReportGetPayload;
    } catch (error) {
      this.logger.error(error);
      throw new ActionFailedException(ActionFailed.REPORT_NOT_FOUND);
    }

    const subsriptionDtos = await this.getSubscriptionDetail(user, report.subscriptionId);
    const feedbackDtos = await this.getFeedbackDetail(report.Feedback);

    return { report, subscription: subsriptionDtos, feedback: feedbackDtos };
  }

  async getFeedbackDetail(feedback: Feedback) {
    this.logger.log('🚀 ~ ReportService ~ getFeedbackDetail ~ feedback:', feedback);
    if (!feedback || !feedback.subscriptionId) return null;

    // const { mentorData, studentInfo, subscription } = await this.subscriptionService.detail(feedback.subscriptionId);

    // const subscriptionDtos = SubscriptionDetailRESP.fromEntity(
    //   subscription,
    //   mentorData.mentor,
    //   AccountRESP.fromEntity(
    //     {
    //       ...studentInfo.account,
    //       dob: String(studentInfo.account.dob),
    //     },
    //     studentInfo.thumbnail,
    //   ),
    //   mentorData.thumbnail,
    // );

    // const { dtos: feedbackDtoList } = await this.feedbackService.list({
    //   relationId: subscription.courseId,
    //   relationType: FeedbackRelation.COURSE,
    // });

    // const audioCall = await this.transactionHost.tx.audioRoom.findFirst({
    //   where: { Subscription: { id: feedback.subscriptionId } },
    //   select: { id: true, cid: true },
    // });

    const reviewer = await this.accountService.getMe(feedback.reviewerId);

    return ReportDetailHelper.fromReportFeedback(feedback, {
      id: reviewer.account.id,
      name: reviewer.account.name,
      thumbnail: reviewer.thumbnail,
    });
  }

  async getSubscriptionDetail(user: AuthUserDTO, subscriptionId: number) {
    if (!subscriptionId) return null;
    const { mentorData, studentInfo, subscription } = await this.subscriptionService.detail(user, subscriptionId);

    const subscriptionDto = SubscriptionDetailRESP.fromEntity(
      subscription,
      mentorData.mentor,
      AccountRESP.fromEntity(
        {
          ...studentInfo.account,
          dob: String(studentInfo.account.dob),
        },
        studentInfo.thumbnail,
      ),
      mentorData.thumbnail,
    );

    const { dtos: feedbackDtoList } = await this.feedbackService.list({
      relationId: subscription.courseId,
      relationType: FeedbackRelation.COURSE,
    });

    const audioCall = await this.transactionHost.tx.audioRoom.findFirst({
      where: { Subscriptions: { some: { id: subscriptionId } } },
      select: { id: true, cid: true },
    });

    return ReportDetailHelper.fromReportSubscription({
      ...subscriptionDto,
      audioCall: orNullWithCondition(!!audioCall, { id: audioCall.id, cid: audioCall.cid }),
      feedbacks: feedbackDtoList.map((e) => ({
        id: e.id,
        courseRating: e.courseRating,
        mentorRating: e.mentorRating,
        courseReview: e.courseReview,
        mentorReview: e.mentorReview,
        updatedAt: e.updatedAt,
      })),
    });
  }

  @Transactional(TRANSACTION_TIMEOUT)
  async resolveFeedback(reportId: number, body: ReportResolveFeedbackREQ) {
    const report = await this.transactionHost.tx.report.findFirst({
      where: { id: reportId },
      select: { id: true, status: true, type: true },
    });

    if (!report) {
      throw new ActionFailedException(ActionFailed.REPORT_FEEDBACK_NOT_FOUND);
    } else if (!REPORT_FEEDBACK_TYPE.includes(report.type)) {
      throw new ActionFailedException(ActionFailed.REPORT_INVALID_TYPE, `The report ${report.type} is not feedback`);
    }

    const updatedReport = await this.transactionHost.tx.report.update({
      where: { id: report.id },
      data: { status: body.status, resolution: body.resolution },
      select: { id: true, reporterId: true, feedbackId: true },
    });

    await this.transactionHost.tx.feedback.delete({ where: { id: updatedReport.feedbackId } });

    //TODO: Warning the student about their negative feedback, and maybe ban them from the platform for 30 days

    this.createNotificationReportFeedback(updatedReport as Report, body);
  }

  @Transactional(TRANSACTION_TIMEOUT)
  async resolveSubscriptionReport(reportId: number, body: ReportResolveSubscriptionREQ) {
    this.logger.log('🚀 ~ ReportService ~ resolveSubscriptionReport ~ body:', body);
    const report = await this.transactionHost.tx.report.findFirst({
      where: { id: reportId },
      select: { id: true, status: true, type: true, reporterId: true, subscriptionId: true },
    });

    if (!report) {
      throw new ActionFailedException(ActionFailed.REPORT_FEEDBACK_NOT_FOUND);
    } else if (!REPORT_SUBSCRIPTION_TYPE.includes(report.type)) {
      throw new ActionFailedException(ActionFailed.REPORT_INVALID_TYPE, `The report ${report.type} is not subscription`);
    }

    if (body.status === ReportStatus.RESOLVED) {
      const subscription = (await this.transactionHost.tx.subscription.findFirst({
        where: { id: report.subscriptionId },
        select: {
          id: true,
          courseAccessStartAt: true,
          audioRoomId: true,
          Course: { select: { id: true, creatorId: true, status: true, totalDuration: true } },
        },
      })) as SubscriptionGetPlayload;

      if (body.isSuspended) {
        await this.performSuspension(subscription, body);
      } else await this.handleSubscriptionPushnishment(report as Report, subscription); //handle the pushnishment by system;
    }

    const updatedReport = await this.transactionHost.tx.report.update({
      where: { id: report.id },
      data: { status: body.isSuspended ? ReportStatus.RESOLVED : body.status, resolution: body.resolution },
      select: { id: true, reporterId: true, subscriptionId: true },
    });

    this.logger.log('🚀 ~ ReportService ~ resolveSubscriptionReport ~ Report Subscription after updated:', updatedReport);
  }

  private async performSuspension(
    subscription: SubscriptionGetPlayload,
    body: { suspensionType: string; coursePunishmentType?: CourseSuspensionType; mentorPunishmentType?: AccountSuspensionType },
  ) {
    const suspendedAt = nowEpoch();
    if (body.suspensionType === 'COURSE') {
      this.logger.log(
        `🚀 ~ ReportService ~ performSuspension ~ handle suspension manually for course with id ${subscription.Course.id}`,
      );

      // Cancel all related subscriptions in active status relating to the course
      await this.cancelAllRelatedSubscriptions(subscription.Course.id, subscription, 'COURSE');

      return this.transactionHost.tx.course.update({
        where: { id: subscription.Course.id },
        data: {
          status: CourseStatus.SUSPENDED,
          suspendedAt,
          suspensionType: body.coursePunishmentType,
        },
      });
    } else {
      this.logger.log(
        `🚀 ~ ReportService ~ performSuspension ~ handle suspension manually for mentor with account id ${subscription.Course.creatorId}`,
      );

      const courses = await this.transactionHost.tx.course.findMany({
        where: { creatorId: subscription.Course.creatorId, status: { in: [CourseStatus.APPROVED] } },
        select: { id: true },
      });

      for (const c of courses) {
        this.logger.warn(`🚀 ~ ReportService ~ performSuspension ~ cancel all related subscriptions for course with id ${c.id}`);
        await this.cancelAllRelatedSubscriptions(c.id, subscription, 'MENTOR');
      }

      return this.transactionHost.tx.account.update({
        where: { id: subscription.Course.creatorId },
        data: {
          status: AccountStatus.SUSPENDED,
          suspendedAt,
          suspensionType: body.mentorPunishmentType,
        },
      });
    }
  }

  //TODO: Check the logic of this method morning
  async handleSubscriptionPushnishment(report: Report, subscription: SubscriptionGetPlayload) {
    switch (report.type) {
      case ReportType.COURSE_UNQUALIFIED:
        //Get resolved report of COURSES within 3 months
        //Handle the punishment for courses
        if (subscription.Course?.status === CourseStatus.SUSPENDED) return;
        await this.handleCourseSuspension(subscription, report);
        break;
      case ReportType.MENTOR_ISSUES:
        //Get resolved report of MENTORS within 3 months
        //Handle the punishment for mentors
        const accountMentor = await this.transactionHost.tx.account.findUnique({
          where: { id: subscription.Course.creatorId },
          select: { id: true, status: true },
        });
        if (accountMentor.status === AccountStatus.SUSPENDED) return;
        await this.handleMentorSuspension(subscription, report);
        break;
      default:
        break;
    }
  }

  /* Method: Handle Mentor Suspension */
  private async handleMentorSuspension(subscription: SubscriptionGetPlayload, report: Report) {
    this.logger.log('🚀 ~ ReportService ~ handleMentorSuspension ~ subscriptionId:', subscription);
    const noOfReportMentors = await this.getResolvedMentorReportsCount(subscription.Course.creatorId);
    this.logger.log('🚀 ~ ReportService ~ handleMentorSuspension ~ noOfReportMentors:', noOfReportMentors);

    //Get resolved report of MENTORS within 3 months
    // If the number of reports is greater than or equal 5 and less than or equal 7, suspend the mentor for 3 days
    // If the number of reports is greater than 5 and less than 11, suspend the mentor for 7 days
    // If the number of reports is greater than greater than or equal 11, suspend the mentor permanently
    const suspensionType = ReportResolveHelper.calculateAccountSuspensionDays(noOfReportMentors);

    if (suspensionType !== AccountSuspensionType.ACCOUNT_NOT_SUSPENDED) {
      const course = await this.transactionHost.tx.course.findMany({
        where: { creatorId: subscription.Course.creatorId },
        select: { id: true },
      });

      for (const c of course) {
        await this.cancelAllRelatedSubscriptions(c.id, subscription, 'MENTOR');
      }
    }

    await this.suspendAccount(subscription.Course.creatorId, suspensionType);

    //Refund base on access time of mentors
    //If the access time of mentors contains more than 70% of the total duration of the course, refund 30% of the course fee
    //If the access time of mentors contains less than 70% of the total duration of the course, refund 50% of the course fee
    //If the access time of mentors contains less than 40% of the total duration of the course, refund 100% of the course fee
    await this.handleSubscriptionPaymentCut(subscription);

    const suspensionPayload = NotificationHelper.makeAppNotificationPayload(
      { id: subscription.id, type: NotificationRelationType.MENTOR },
      subscription.Course.creatorId,
      NOTIFICATION_SUSPENSION_ACCOUNT_MAPPER.get(suspensionType),
    );

    const resolveSubsriptionPayload = NotificationHelper.makeAppNotificationPayload(
      { id: subscription.id, type: NotificationRelationType.SUBSCRIPTION },
      report.reporterId,
      NotificationType.REPORT_RESOLVED,
    );

    runFunctionWithCondition(!!subscription, () => {
      this.eventEmitterService.emit<NotificationAppHandlerPayload>(NotificationChannel.APP, suspensionPayload);
      this.eventEmitterService.emit<NotificationAppHandlerPayload>(NotificationChannel.APP, resolveSubsriptionPayload);
    });
  }

  private async suspendAccount(accountId: number, suspensionType: AccountSuspensionType) {
    if (suspensionType === AccountSuspensionType.ACCOUNT_NOT_SUSPENDED) return;
    await this.transactionHost.tx.account.update({
      where: { id: accountId },
      data: { status: AccountStatus.SUSPENDED, suspendedAt: nowEpoch(), suspensionType },
      select: { id: true },
    });
  }

  private async getResolvedMentorReportsCount(creatorId: number) {
    // return this.transactionHost.tx.report.count({
    //   where: {
    //     Subscription: { Course: { creatorId } },
    //     status: ReportStatus.RESOLVED,
    //     type: ReportType.MENTOR_ISSUES,
    //     createdAt: { gte: nowEpoch() - REPORT_DURATION_TIME_QUERY },
    //   },
    // });

    const subscriptions = await this.transactionHost.tx.subscription.findMany({
      where: { Course: { creatorId }, Report: { status: ReportStatus.RESOLVED, type: ReportType.COURSE_UNQUALIFIED } },
      select: { id: true, courseAccessStartAt: true, audioRoomId: true },
    });

    const resolvedMentorReport = new Set<string>();

    for (const sub of subscriptions) {
      const stringKey = `${sub.courseAccessStartAt}_${sub.audioRoomId}`;
      resolvedMentorReport.add(stringKey);
    }

    return resolvedMentorReport.size;
  }

  /* Method: Handle Course Suspension */
  private async handleCourseSuspension(subscription: SubscriptionGetPlayload, report: Report) {
    this.logger.log('🚀 ~ ReportService ~ handleCourseSuspension ~ subscriptionId:', subscription);

    const noOfCourseReports = await this.getResolvedCourseReportsCount(subscription.Course.id);
    this.logger.log('🚀 ~ ReportService ~ handleCourseSuspension ~ noOfCourseReports:', noOfCourseReports);

    //Get resolved report of COURSES within 3 months
    // If the number of reports is greater than 3, suspend the mentor for 3 days
    // If the number of reports is greater than 5, suspend the mentor for 7 days
    // If the number of reports is greater than 7, suspend the mentor permanently
    const suspensionTypeCourse = ReportResolveHelper.calculateCourseSuspensionDays(noOfCourseReports);

    // Cancel all related subscriptions in active status relating to the course
    if (suspensionTypeCourse !== CourseSuspensionType.COURSE_NOT_SUSPENDED) {
      await this.cancelAllRelatedSubscriptions(subscription.Course.id, subscription, 'COURSE');
    }

    this.logger.log('🚀 ~ ReportService ~ handleCourseSuspension ~ suspensionTypeCourse:', suspensionTypeCourse);
    const suspendedCourse = await this.suspendCourse(subscription.Course.id, suspensionTypeCourse);

    //Refund base on access time of mentors
    //If the access time of mentors contains more than 70% of the total duration of the course, refund 30% of the course fee
    //If the access time of mentors contains less than 70% of the total duration of the course, refund 50% of the course fee
    //If the access time of mentors contains less than 40% of the total duration of the course, refund 100% of the course fee
    //TODO: Implement refund for the subscription

    await this.handleSubscriptionPaymentCut(subscription);

    const suspensionPayloadCourse = NotificationHelper.makeAppNotificationPayload(
      { id: subscription.id, type: NotificationRelationType.COURSE },
      subscription.Course.creatorId,
      NOTIFICATION_SUSPENSION_COURSE_MAPPER.get(suspensionTypeCourse),
    );

    const resolveSubsriptionPayloadCourse = NotificationHelper.makeAppNotificationPayload(
      { id: subscription.id, type: NotificationRelationType.REPORT },
      report.reporterId,
      NotificationType.REPORT_RESOLVED,
    );

    runFunctionWithCondition(!!suspendedCourse, () => {
      this.eventEmitterService.emit<NotificationAppHandlerPayload>(NotificationChannel.APP, suspensionPayloadCourse);
      this.eventEmitterService.emit<NotificationAppHandlerPayload>(NotificationChannel.APP, resolveSubsriptionPayloadCourse);
    });
  }

  private async cancelAllRelatedSubscriptions(
    courseId: number,
    subscription: SubscriptionGetPlayload,
    type: 'MENTOR' | 'COURSE',
  ) {
    const canceledSubscriptions = await this.transactionHost.tx.subscription.findMany({
      where: {
        Course: { id: courseId },
        status: { in: SUBSCRIPTION_ACTIVE_STATUS },
      },
      select: {
        id: true,
        status: true,
        audioRoomId: true,
        accountId: true,
        AudioRoom: { select: { id: true, status: true } },
        Payment: { select: { id: true } },
      },
    });

    const combinedSubscriptions = await this.transactionHost.tx.subscription.findMany({
      where: { courseId: courseId, courseAccessStartAt: subscription.courseAccessStartAt, audioRoomId: subscription.audioRoomId },
      select: { id: true, status: true, audioRoomId: true, accountId: true, Payment: { select: { id: true } } },
    });

    for (const sub of [...canceledSubscriptions, ...combinedSubscriptions]) {
      // Handle claim for current combined subscription
      if (subscription.status === SubscriptionStatus.CANCELED) continue;

      const updatedPayment = orUndefinedWithCondition(!!sub.Payment, {
        Payment: {
          update: {
            data: { status: sub.status === SubscriptionStatus.ACTIVE ? PaymentStatus.REFUNDING : PaymentStatus.CANCELED },
          },
        },
      });

      if (sub.audioRoomId) {
        await this.transactionHost.tx.audioRoom.update({
          where: { id: sub.audioRoomId },
          data: { status: RoomStatus.CANCELLED },
          select: { id: true },
        });
      }

      const updatedSub = await this.transactionHost.tx.subscription.update({
        where: { id: sub.id },
        data: {
          canceledAt: nowEpoch(),
          status: SubscriptionStatus.CANCELED,
          ...updatedPayment,
        },
        select: { id: true },
      });

      await this.transactionHost.tx.mentorSchedule.deleteMany({ where: { courseId } });

      const notificationType =
        sub.status === SubscriptionStatus.ACTIVE
          ? type === 'MENTOR'
            ? NotificationType.SUBSCRIPTION_REFUND_BECAUSE_OF_MENTOR_SUSPENSION
            : NotificationType.SUBSCRIPTION_REFUND_BECAUSE_OF_COURSE_SUSPENSION
          : type === 'MENTOR'
            ? NotificationType.SUBSCRIPTION_CANCELED_BECAUSE_OF_MENTOR_SUSPENSION
            : NotificationType.SUBSCRIPTION_CANCELED_BECAUSE_OF_COURSE_SUSPENSION;

      const cancelSubPayload = NotificationHelper.makeAppNotificationPayload(
        { id: sub.id, type: NotificationRelationType.SUBSCRIPTION },
        sub.accountId,
        notificationType,
      );

      // IMPLEMENT MAIL TO APOLOGIZE FOR THE CANCELLED SUBSCRIPTION

      runFunctionWithCondition(!!updatedSub, () => {
        this.eventEmitterService.emit<NotificationAppHandlerPayload>(NotificationChannel.APP, cancelSubPayload);
      });
    }
  }

  private async suspendCourse(courseId: number, suspensionType: CourseSuspensionType) {
    if (suspensionType === CourseSuspensionType.COURSE_NOT_SUSPENDED) return;

    return this.transactionHost.tx.course.update({
      where: { id: courseId },
      data: { status: CourseStatus.SUSPENDED, suspendedAt: nowEpoch(), suspensionType },
      select: { id: true },
    });
  }

  private async getResolvedCourseReportsCount(courseId: number) {
    // return this.transactionHost.tx.report.count({
    //   where: {
    //     Subscription: {   Course: { id: courseId } },
    //     status: ReportStatus.RESOLVED,
    //     type: ReportType.COURSE_UNQUALIFIED,
    //     createdAt: { gte: nowEpoch() - REPORT_DURATION_TIME_QUERY },
    //   },

    // });

    const subscriptions = await this.transactionHost.tx.subscription.findMany({
      where: { courseId: courseId, Report: { status: ReportStatus.RESOLVED, type: ReportType.COURSE_UNQUALIFIED } },
      select: { id: true, courseAccessStartAt: true, audioRoomId: true },
    });

    const resolvedCourseReport = new Set<string>();

    for (const sub of subscriptions) {
      const stringKey = `${sub.courseAccessStartAt}_${sub.audioRoomId}`;
      resolvedCourseReport.add(stringKey);
    }

    return resolvedCourseReport.size;
  }

  /* Method: Handle Subscription Payment Cut */
  private async handleSubscriptionPaymentCut(subscription: SubscriptionGetPlayload) {
    const audioRoomHistories = (await this.transactionHost.tx.audioRoomActivityHistory.findMany({
      where: { AudioRoomParticipant: { accountId: subscription.Course.creatorId, roomId: subscription.audioRoomId } },
      orderBy: { joinedAt: SortOrder.DESC },
      select: { joinedAt: true, leftAt: true },
    })) as AudioRoomActivityHistory[];

    const totalTimeInAudioRoom = ReportResolveHelper.getTotalTimeInAudioRoom(audioRoomHistories);

    this.logger.log('🚀 ~ ReportService ~ handleSubscriptionPaymentCut ~ totalTimeInAudioRoom:', totalTimeInAudioRoom);

    //TODO: Implement NOTIFICATION
  }

  async createNotificationSubscriptionFeedback(report: Report, body: ReportResolveFeedbackREQ) {
    const isResolved = body.status === ReportStatus.RESOLVED;

    // notification receiver includes mentor (reporter) and feedback owner
    const reporterPayload = NotificationHelper.makeAppNotificationPayload(
      { id: report.id, type: NotificationRelationType.REPORT },
      report.reporterId,
      isResolved ? NotificationType.REPORT_RESOLVED : NotificationType.REPORT_REJECTED,
    );

    if (isResolved) {
      const feeback = await this.transactionHost.tx.feedback.findUnique({
        where: { id: report.feedbackId },
        select: { id: true, reviewerId: true },
      });

      const feedbackPayload = NotificationHelper.makeAppNotificationPayload(
        { id: report.feedbackId, type: NotificationRelationType.FEEDBACK },
        report.reporterId,
        NotificationType.FEEDBACK_CONTAIN_INAPPROPRIATE_CONTENT,
      );

      this.logger.log('🚀 ~ ReportService ~ createNotificationReportFeedback ~ feedbackPayload created:', feedbackPayload);

      runFunctionWithCondition(!!feeback, () => {
        this.eventEmitterService.emit<NotificationAppHandlerPayload>(NotificationChannel.APP, feedbackPayload);
      });
    }

    runFunctionWithCondition(!!report, () => {
      this.eventEmitterService.emit<NotificationAppHandlerPayload>(NotificationChannel.APP, reporterPayload);
    });
  }

  async createNotificationReportFeedback(report: Report, body: ReportResolveFeedbackREQ) {
    const isResolved = body.status === ReportStatus.RESOLVED;

    // notification receiver includes mentor (reporter) and feedback owner
    const reporterPayload = NotificationHelper.makeAppNotificationPayload(
      { id: report.id, type: NotificationRelationType.REPORT },
      report.reporterId,
      isResolved ? NotificationType.REPORT_RESOLVED : NotificationType.REPORT_REJECTED,
    );

    if (isResolved) {
      const feeback = await this.transactionHost.tx.feedback.findUnique({
        where: { id: report.feedbackId },
        select: { id: true, reviewerId: true },
      });

      const feedbackPayload = NotificationHelper.makeAppNotificationPayload(
        { id: report.feedbackId, type: NotificationRelationType.FEEDBACK },
        report.reporterId,
        NotificationType.FEEDBACK_CONTAIN_INAPPROPRIATE_CONTENT,
      );

      this.logger.log('🚀 ~ ReportService ~ createNotificationReportFeedback ~ feedbackPayload created:', feedbackPayload);

      runFunctionWithCondition(!!feeback, () => {
        this.eventEmitterService.emit<NotificationAppHandlerPayload>(NotificationChannel.APP, feedbackPayload);
      });
    }

    runFunctionWithCondition(!!report, () => {
      this.eventEmitterService.emit<NotificationAppHandlerPayload>(NotificationChannel.APP, reporterPayload);
    });
  }

  async createSubscriptionReport(user: AuthUserDTO, body: ReportClientSubscriptionCreateREQ) {
    let subscription: SubscriptionGetPlayload;
    if (!REPORT_SUBSCRIPTION_TYPE.includes(body.type)) {
      throw new ActionFailedException(
        ActionFailed.REPORT_INVALID_TYPE,
        `The type ${body.type} is invalid, the types are ${REPORT_SUBSCRIPTION_TYPE.join(', ')}`,
      );
    }

    try {
      subscription = (await this.transactionHost.tx.subscription.findUniqueOrThrow({
        where: { id: body.subscriptionId, accountId: user.accountId },
        select: { id: true, courseId: true },
      })) as SubscriptionGetPlayload;
    } catch (error) {
      this.logger.error(error);
      throw new ActionFailedException(ActionFailed.SUBSCRIPTION_NOT_BELONG_TO_USER);
    }

    const report = await this.transactionHost.tx.report.create(
      ReportCreateHelper.toCreate<ReportClientSubscriptionCreateREQ>(user, body),
    );

    const admin = await this.transactionHost.tx.account.findFirst({
      where: { accountType: AccountType.ADMIN },
      select: { id: true },
    });

    const payload = NotificationHelper.makeAppNotificationPayload(
      { id: subscription.id, type: NotificationRelationType.SUBSCRIPTION },
      admin.id,
      ReportNotificationMap.get(body.type),
    );

    runFunctionWithCondition(!!report, () => {
      this.eventEmitterService.emit<NotificationAppHandlerPayload>(NotificationChannel.APP, payload);
    });
  }

  async createReportFeedback(user: AuthUserDTO, body: ReportClientFeedbackCreateREQ) {
    if (!REPORT_FEEDBACK_TYPE.includes(body.type)) {
      throw new ActionFailedException(
        ActionFailed.REPORT_INVALID_TYPE,
        `The type ${body.type} is invalid, the types are ${REPORT_FEEDBACK_TYPE.join(', ')}`,
      );
    }

    let feedback: FeedbackGetPayload;
    try {
      feedback = (await this.transactionHost.tx.feedback.findUniqueOrThrow({
        where: { id: body.feedbackId, reviewerId: user.accountId },
        select: { id: true },
      })) as FeedbackGetPayload;
    } catch (error) {
      this.logger.error(error);
      throw new ActionFailedException(ActionFailed.FEEDBACK_NOT_BELONG_TO_REVIEWER);
    }

    const report = await this.transactionHost.tx.report.create(
      ReportCreateHelper.toCreate<ReportClientFeedbackCreateREQ>(user, body),
    );

    const admin = await this.transactionHost.tx.account.findFirst({
      where: { accountType: AccountType.ADMIN },
      select: { id: true },
    });

    const payload = NotificationHelper.makeAppNotificationPayload(
      { id: feedback.id, type: NotificationRelationType.FEEDBACK },
      admin.id,
      ReportNotificationMap.get(body.type),
    );

    runFunctionWithCondition(!!report, () => {
      this.eventEmitterService.emit<NotificationAppHandlerPayload>(NotificationChannel.APP, payload);
    });
  }
}

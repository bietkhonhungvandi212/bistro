import { Injectable } from '@nestjs/common';
import { Course, NotificationRelationType, Payment } from '@prisma/client';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { TransactionHost } from 'src/services/prisma/transactions/transaction-host';
import { Transactional } from 'src/services/prisma/transactions/transactional.decorator';
import { TRANSACTION_TIMEOUT } from 'src/shared/constants/prisma.constant';
import { PaginationResponse } from 'src/shared/generics/pagination.response';
import { parseEpoch } from 'src/shared/parsers/common.parser';
import { AudioRoomGetPayload } from '../audio-call/shared/types';
import { AuthUserDTO } from '../auth/dto/auth-user.dto';
import { FeedbackGetPayload } from '../feedback/shared/type';
import { ImageService } from '../image/image.service';
import { MentorGetPayload } from '../mentor/shared/types';
import { ReportGetPayload } from '../report/shared/type';
import { SubscriptionGetPlayload } from '../subscription/shared/types';
import { NotificationCreateREQ } from './request/notification-create.request';
import { NotificationListREQ } from './request/notification-list.request';
import { NotificationReadREQ } from './request/notification-read.request';
import {
  NotificationAudioRoomDetailRESP,
  NotificationCourseDetailRESP,
  NotificationFeedbackDetailRESP,
  NotificationMentorDetailRESP,
  NotificationPaymentDetailRESP,
  NotificationReportDetailRESP,
  NotificationRESP,
  NotificationSubscriptionDetailRESP,
} from './response/notification.response';
import { Propagation } from './shared/transation.enum';
import { NotificationGetPayload } from './shared/types';

@Injectable()
export class NotificationService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly imageService: ImageService,
    private readonly transactionHost: TransactionHost,
  ) {}

  async list(user: AuthUserDTO, query: NotificationListREQ) {
    const notifications = await this.prismaService.notification.findMany(NotificationListREQ.toFindMany(user, query));
    const count = await this.prismaService.notification.count({
      where: NotificationListREQ.toQueryCondition(user, query),
    });

    const response = await Promise.all(
      notifications.map(async (notification: NotificationGetPayload) => {
        const relation = await this.findDetailRelation(notification.relationId, notification.relationType);
        return NotificationRESP.fromEntity(notification, relation);
      }),
    );

    return PaginationResponse.ofWithTotal(response, count);
  }

  @Transactional(Propagation.RequiresNew, TRANSACTION_TIMEOUT)
  async createNotification(body: NotificationCreateREQ) {
    const notification = await this.transactionHost.tx.notification.create(NotificationCreateREQ.toCreateNotification(body));

    return notification;
  }

  async readNotification(id: number, body: NotificationReadREQ) {
    const notification = await this.transactionHost.tx.notification.update(NotificationReadREQ.toReadNotification(id, body));
    return notification;
  }

  async detail(notificationId: number) {
    const notification = (await this.transactionHost.tx.notification.findFirst({
      where: { id: notificationId },
      select: {
        id: true,
        type: true,
        relationType: true,
        relationId: true,
        title: true,
        content: true,
        scopes: true,
        targetAccountId: true,
        createdAt: true,
      },
    })) as NotificationGetPayload;

    const relation = await this.findDetailRelation(notification.relationId, notification.relationType);

    return NotificationRESP.fromEntity(notification, relation);
  }

  private async findDetailRelation(relationId: number, relationType: NotificationRelationType): Promise<any> {
    switch (relationType) {
      case NotificationRelationType.COURSE:
        return this.findCourseDetail(relationId);
      case NotificationRelationType.PAYMENT:
        return this.findPaymentDetail(relationId);
      case NotificationRelationType.SUBSCRIPTION:
        return this.findSubscriptionDetail(relationId);
      case NotificationRelationType.MENTOR:
        return this.findMentorDetail(relationId);
      case NotificationRelationType.AUDIO_CALL:
        return this.findAudioCallDetail(relationId);
      case NotificationRelationType.FEEDBACK:
        return this.findFeedbackDetail(relationId);
      case NotificationRelationType.REPORT:
        return this.findReportDetail(relationId);
    }
  }

  private async findReportDetail(reportId: number) {
    const report = (await this.transactionHost.tx.report.findFirst({
      where: { id: reportId },
      select: {
        id: true,
        status: true,
        resolution: true,
        Subscription: { select: { id: true } },
        Feedback: { select: { id: true } },
      },
    })) as ReportGetPayload;

    if (!report) return null;

    const subscription = report.Subscription ? await this.findSubscriptionDetail(report.Subscription.id) : null;
    const feedback = report.Feedback ? await this.findFeedbackDetail(report.Feedback.id) : null;

    return NotificationReportDetailRESP.fromEntity(report, subscription, feedback);
  }

  private async findFeedbackDetail(feedbackId: number) {
    const feedback = (await this.transactionHost.tx.feedback.findFirst({
      where: { id: feedbackId },
      select: { id: true, courseRating: true, mentorRating: true, courseReview: true, mentorReview: true, reviewerId: true },
    })) as FeedbackGetPayload;

    if (!feedback) return null;

    return NotificationFeedbackDetailRESP.fromEntity(feedback);
  }

  private async findCourseDetail(courseId: number) {
    const course = (await this.transactionHost.tx.course.findFirst({
      where: { id: courseId },
      select: { id: true, name: true, startDate: true, endDate: true, price: true },
    })) as Course;

    if (!course) return null;

    return NotificationCourseDetailRESP.fromEntity(course);
  }

  private async findAudioCallDetail(audioCallId: number) {
    const audioCall = (await this.transactionHost.tx.audioRoom.findFirst({
      where: { id: audioCallId },
      select: { id: true, title: true, startsAt: true, status: true, cid: true },
    })) as AudioRoomGetPayload;

    if (!audioCall) return null;

    return NotificationAudioRoomDetailRESP.fromEntity(audioCall);
  }

  private async findMentorDetail(mentorId: number) {
    const mentor = (await this.transactionHost.tx.mentor.findFirst({
      where: { id: mentorId },
      select: {
        id: true,
        status: true,
        Account: { select: { id: true, name: true, email: true, phoneNumber: true, avatarId: true } },
      },
    })) as MentorGetPayload;

    if (!mentor) return null;

    const thumbnail = await this.imageService.getImageOriginal(mentor.Account.avatarId);

    return NotificationMentorDetailRESP.fromEntity(mentor, thumbnail);
  }

  private async findPaymentDetail(paymentId: number) {
    const payment = (await this.transactionHost.tx.payment.findFirst({
      where: { id: paymentId },
      select: { id: true, price: true, status: true, subscriptionId: true, createdAt: true },
    })) as Payment;

    if (!payment) return null;

    const subscription = (await this.transactionHost.tx.subscription.findFirst({
      where: { id: payment.subscriptionId },
      select: { id: true, courseId: true, status: true, createdAt: true },
    })) as SubscriptionGetPlayload;
    const course = await this.findCourseDetail(subscription.courseId);

    return NotificationPaymentDetailRESP.fromEntity(payment, {
      id: subscription.id,
      createdAt: parseEpoch(subscription.createdAt),
      course,
    });
  }

  private async findSubscriptionDetail(subscriptionId: number) {
    const subscription = (await this.transactionHost.tx.subscription.findFirst({
      where: { id: subscriptionId },
      select: { id: true, courseId: true, status: true, Payment: { select: { id: true } }, createdAt: true },
    })) as SubscriptionGetPlayload;

    if (!subscription) return null;

    const course = await this.findCourseDetail(subscription.courseId);
    const payment = subscription.Payment ? await this.findPaymentDetail(subscription.Payment?.id) : null;

    return NotificationSubscriptionDetailRESP.fromEntity(subscription, course, payment);
  }
}

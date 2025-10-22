import {
  Course,
  MentorSchedule,
  NotificationRelationType,
  NotificationScope,
  NotificationType,
  Prisma,
  Subscription,
  SubscriptionStatus,
} from '@prisma/client';
import { AuthUserDTO } from 'src/domains/auth/dto/auth-user.dto';
import { NotificationAppHandlerPayload } from 'src/domains/notification/shared/types';
import { getNotificationMessage } from 'src/shared/constants/notification.constant';
import { SortOrder } from 'src/shared/enums/query.enum';
import { connectRelation } from 'src/shared/helpers/prisma.helper';
import { SubscriptionCreateREQ } from '../dto/request/subscription-create.request';
import { parseBookingDateTimeToEpoch } from './subscription-common.helper';

export class SubscriptionCreateHelper {
  static toCreate(
    user: AuthUserDTO,
    course: Course,
    schedule: MentorSchedule,
    body: SubscriptionCreateREQ,
  ): Prisma.SubscriptionCreateArgs {
    if (!course) return;

    const courseAccessStartAt = parseBookingDateTimeToEpoch(body.date, schedule.startTime);
    const courseAccessEndAt = parseBookingDateTimeToEpoch(body.date, schedule.endTime);

    return {
      data: {
        message: body.message,
        originalPrice: course.price,
        status: SubscriptionStatus.PENDING,
        courseAccessEndAt: courseAccessEndAt,
        courseAccessStartAt: courseAccessStartAt,
        Course: connectRelation(course.id),
        Account: connectRelation(user.accountId),
        MentorSchedule: connectRelation(body.mentorScheduleId),
      },
      select: { id: true },
    };
  }

  static toFindMany(courseId: number): Prisma.SubscriptionFindManyArgs {
    return {
      where: { Course: { id: courseId } },
      select: {
        id: true,
        accountId: true,
        status: true,
        createdAt: true,
        canceledAt: true,
        rejectedAt: true,
        mentorScheduleId: true,
        courseAccessStartAt: true,
        courseAccessEndAt: true,
      },
      orderBy: { createdAt: SortOrder.DESC },
    };
  }

  static toFindManyByAccountId(accountId: number): Prisma.SubscriptionFindManyArgs {
    return {
      where: { Account: { id: accountId } },
      select: {
        id: true,
        accountId: true,
        status: true,
        createdAt: true,
        canceledAt: true,
        rejectedAt: true,
        mentorScheduleId: true,
        courseAccessStartAt: true,
        courseAccessEndAt: true,
        Course: { select: { id: true, creatorId: true } },
      },
      orderBy: { createdAt: SortOrder.DESC },
    };
  }

  static toCreateNotification(subcription: Subscription, targetAccountId: number): NotificationAppHandlerPayload {
    return {
      notificationREQ: {
        relationId: subcription.id,
        relationType: NotificationRelationType.SUBSCRIPTION,
        type: NotificationType.SUBSCRIPTION_CREATED,
        scopes: [NotificationScope.INDIVIDUAL],
        targetAccountId: targetAccountId,
      },
      data: {
        title: getNotificationMessage(NotificationType.SUBSCRIPTION_CREATED).title,
        topic: NotificationType.SUBSCRIPTION_CREATED,
        body: getNotificationMessage(NotificationType.SUBSCRIPTION_CREATED).content,
      },
    };
  }
}

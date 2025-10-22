import { AccountType, Prisma, ReportStatus } from '.prisma/client';
import { AuthUserDTO } from 'src/domains/auth/dto/auth-user.dto';
import { QueryPagingHelper } from 'src/shared/helpers/pagination.helper';
import { defaultSortDesc } from 'src/shared/helpers/query.helper';
import { leanObject, parsePrismaSearch } from 'src/shared/parsers/common.parser';
import { orUndefinedWithCondition } from 'src/shared/parsers/io.parser';
import { SubscriptionAdminListREQ } from '../dto/request/subscription-admin-list.request';
import { SubscriptionClientListREQ } from '../dto/request/subscription-client-list-request';

export class SubscriptionListHelper {
  static toFindMany(): Prisma.SubscriptionFindManyArgs {
    return {
      select: {
        id: true,
        status: true,
        originalPrice: true,
        courseAccessStartAt: true,
        courseAccessEndAt: true,
        Course: { select: { id: true, name: true, creatorId: true } },
        Payment: { select: { id: true, status: true, price: true } },
        Account: { select: { id: true } },
      },
    };
  }

  static toFindManyCombinationWithAccount(user: AuthUserDTO, query: SubscriptionClientListREQ): Prisma.SubscriptionFindManyArgs {
    const reportCondition =
      user.accountType === AccountType.MENTOR
        ? {
            where: { status: ReportStatus.RESOLVED },
          }
        : undefined;

    return {
      where: { ...SubscriptionListHelper.toFilterByAccount(user), status: query.status },
      select: {
        id: true,
        status: true,
        originalPrice: true,
        courseAccessStartAt: true,
        courseAccessEndAt: true,
        canceledAt: true,
        approvedAt: true,
        rejectedAt: true,
        Course: { select: { id: true, name: true, creatorId: true } },
        Payment: { select: { id: true, status: true, price: true } },
        AudioRoom: { select: { id: true, status: true, cid: true } },
        MentorSchedule: { select: { id: true } },
        Report: {
          ...reportCondition,
          select: { id: true, type: true, description: true, status: true, resolution: true, createdAt: true },
        },
        Feedback: { select: { id: true, courseRating: true, mentorRating: true, courseReview: true, mentorReview: true } },
        Account: { select: { id: true } },
      },
    };
  }

  static toFindManyCombination(query: SubscriptionClientListREQ): Prisma.SubscriptionFindManyArgs {
    return {
      where: { status: query.status },
      select: {
        id: true,
        status: true,
        originalPrice: true,
        courseAccessStartAt: true,
        courseAccessEndAt: true,
        canceledAt: true,
        approvedAt: true,
        rejectedAt: true,
        Course: { select: { id: true, name: true, creatorId: true } },
        Payment: { select: { id: true, status: true, price: true } },
        AudioRoom: { select: { id: true, status: true, cid: true } },
        MentorSchedule: { select: { id: true } },
        Report: {
          select: { id: true, type: true, description: true, status: true, resolution: true, createdAt: true },
        },
        Feedback: { select: { id: true, courseRating: true, mentorRating: true, courseReview: true, mentorReview: true } },
        Account: { select: { id: true } },
      },
    };
  }

  static toFindManyWithAccount(user: AuthUserDTO, query: SubscriptionClientListREQ): Prisma.SubscriptionFindManyArgs {
    const reportCondition =
      user.accountType === AccountType.MENTOR
        ? {
            where: { status: ReportStatus.RESOLVED },
          }
        : undefined;

    return {
      where: { ...SubscriptionListHelper.toFilterByAccount(user), status: query.status },
      select: {
        id: true,
        status: true,
        originalPrice: true,
        courseAccessStartAt: true,
        courseAccessEndAt: true,
        canceledAt: true,
        approvedAt: true,
        rejectedAt: true,
        Course: { select: { id: true, name: true, creatorId: true } },
        Payment: { select: { id: true, status: true, price: true } },
        AudioRoom: { select: { id: true, status: true, cid: true } },
        MentorSchedule: { select: { id: true } },
        Report: {
          ...reportCondition,
          select: { id: true, type: true, description: true, status: true, resolution: true, createdAt: true },
        },
        Feedback: { select: { id: true, courseRating: true, mentorRating: true, courseReview: true, mentorReview: true } },
        Account: { select: { id: true } },
      },
    };
  }

  static toFindManyCombinationWithAccountAndParams(
    user: AuthUserDTO,
    condition: { courseStartsAt: any; courseId: number; callId: number },
  ): Prisma.SubscriptionFindManyArgs {
    const reportCondition =
      user.accountType === AccountType.MENTOR
        ? {
            where: { status: ReportStatus.RESOLVED },
          }
        : undefined;

    return {
      where: {
        ...SubscriptionListHelper.toFilterByAccount(user),
        courseAccessStartAt: condition.courseStartsAt,
        courseId: condition.courseId,
        AudioRoom: { id: condition.callId },
      },
      select: {
        id: true,
        status: true,
        originalPrice: true,
        courseAccessStartAt: true,
        courseAccessEndAt: true,
        canceledAt: true,
        approvedAt: true,
        rejectedAt: true,
        Course: { select: { id: true, name: true, creatorId: true } },
        Payment: { select: { id: true, status: true, price: true } },
        AudioRoom: { select: { id: true, status: true, cid: true } },
        MentorSchedule: { select: { id: true } },
        Report: {
          ...reportCondition,
          select: { id: true, type: true, description: true, status: true, resolution: true, createdAt: true },
        },
        Feedback: { select: { id: true, courseRating: true, mentorRating: true, courseReview: true, mentorReview: true } },
        Account: { select: { id: true } },
      },
    };
  }

  static toFindManyWithCondition(query: SubscriptionAdminListREQ): Prisma.SubscriptionFindManyArgs {
    const condition = SubscriptionListHelper.toFilterByCondition(query);
    return {
      where: condition,
      ...QueryPagingHelper.queryPaging(query),
      orderBy: defaultSortDesc,
      select: {
        id: true,
        status: true,
        originalPrice: true,
        courseAccessStartAt: true,
        courseAccessEndAt: true,
        Account: { select: { id: true, name: true } },
        Course: { select: { id: true, name: true, Creator: { select: { id: true, name: true } } } },
      },
    };
  }

  static toFilterByCondition(query: SubscriptionAdminListREQ): Prisma.SubscriptionFindManyArgs['where'] {
    const studentName = orUndefinedWithCondition(!!query.studentName, {
      Account: parsePrismaSearch('name', query.studentName),
    });

    const mentorName = orUndefinedWithCondition(!!query.mentorName, {
      Course: {
        Creator: parsePrismaSearch('name', query.mentorName),
      },
    });

    const courseName = orUndefinedWithCondition(!!query.courseName, {
      Course: parsePrismaSearch('name', query.courseName),
    });

    return leanObject({
      ...studentName,
      ...mentorName,
      ...courseName,
      status: query.status,
    });
  }

  static toFilterByAccount(user: AuthUserDTO): Prisma.SubscriptionFindManyArgs['where'] {
    switch (user.accountType) {
      case AccountType.STUDENT: {
        return { accountId: user.accountId };
      }
      case AccountType.MENTOR: {
        return {
          Course: { creatorId: user.accountId },
        };
      }
      default:
        return;
    }
  }
}

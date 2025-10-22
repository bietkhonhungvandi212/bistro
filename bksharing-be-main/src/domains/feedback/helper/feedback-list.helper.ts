import { Prisma } from '@prisma/client';
import { QueryPagingHelper } from 'src/shared/helpers/pagination.helper';
import { defaultSortDesc } from 'src/shared/helpers/query.helper';
import { parseEpoch } from 'src/shared/parsers/common.parser';
import { orNullWithCondition } from 'src/shared/parsers/io.parser';
import { FeedbackListREQ } from '../request/feedback-list.request';
import { FeedbackListRESP } from '../response/feedback-list.response';
import { FeedbackGetPayload, FeedbackRelation, ReviewerAccount } from '../shared/type';

export class FeedbackListHelper {
  static toQueryCondition(query: FeedbackListREQ): Prisma.FeedbackFindManyArgs['where'] {
    const relation =
      query.relationType === FeedbackRelation.COURSE
        ? {
            Subscription: {
              courseId: query.relationId,
            },
          }
        : {
            Subscription: {
              Course: { Creator: { Mentors: { some: { id: query.relationId } } } },
            },
          };

    return { ...relation };
  }

  static toFindMany(query: FeedbackListREQ): Prisma.FeedbackFindManyArgs {
    const condition = FeedbackListHelper.toQueryCondition(query);
    return {
      where: condition,
      orderBy: defaultSortDesc,
      ...QueryPagingHelper.queryPaging(query),
      select: {
        id: true,
        reviewerId: true,
        courseRating: true,
        mentorRating: true,
        courseReview: true,
        mentorReview: true,
        subscriptionId: true,
        Report: { select: { id: true, type: true, description: true, status: true, resolution: true } },
        updatedAt: true,
      },
    };
  }

  static findManyByAccountId(accountId: number): Prisma.FeedbackFindManyArgs {
    return {
      where: {
        Subscription: { Course: { Creator: { id: accountId } } },
      },

      select: {
        id: true,
        reviewerId: true,
        courseRating: true,
        mentorRating: true,
        courseReview: true,
        mentorReview: true,
        subscriptionId: true,
        updatedAt: true,
      },
    };
  }

  static fromEntity(e: FeedbackGetPayload, account: ReviewerAccount): FeedbackListRESP {
    return {
      id: e.id,
      subscriptionId: e.subscriptionId,
      courseRating: e.courseRating,
      mentorRating: e.mentorRating,
      courseReview: e.courseReview,
      mentorReview: e.mentorReview,
      reviewer: account,
      updatedAt: parseEpoch(e.updatedAt),
      report: orNullWithCondition(!!e.Report, {
        id: e.Report?.id,
        type: e.Report?.type,
        description: e.Report?.description,
        status: e.Report?.status,
        resolution: e.Report?.resolution,
      }),
    };
  }
}

import { Prisma } from '@prisma/client';
import { connectRelation } from 'src/shared/helpers/prisma.helper';
import { FeedbackCreateREQ } from '../request/feedback-create.request';

export class FeedbackCreateHelper {
  static toCreate(reviewerId: number, body: FeedbackCreateREQ): Prisma.FeedbackCreateArgs {
    return {
      data: {
        courseRating: body.courseRating,
        mentorRating: body.mentorRating,
        courseReview: body.courseReview,
        mentorReview: body.mentorReview,
        Reviewer: connectRelation(reviewerId),
        Subscription: connectRelation(body.subscriptionId),
      },
      select: { id: true, subscriptionId: true },
    };
  }
}

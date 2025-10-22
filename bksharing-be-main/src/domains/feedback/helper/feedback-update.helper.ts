import { Prisma } from '@prisma/client';
import { FeedbackUpdateREQ } from '../request/feedback-update.request';

export class FeedbackUpdateHelper {
  static toUpdate(feedbackId: number, body: FeedbackUpdateREQ): Prisma.FeedbackUpdateArgs {
    return {
      where: { id: feedbackId },
      data: {
        courseRating: body.courseRating,
        mentorRating: body.mentorRating,
        courseReview: body.courseReview,
        mentorReview: body.mentorReview,
      },
      select: { id: true },
    };
  }
}

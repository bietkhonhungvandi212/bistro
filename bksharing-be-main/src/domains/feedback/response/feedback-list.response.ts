import { FeedbackReportRESP, ReviewerAccount } from '../shared/type';

export class FeedbackListRESP {
  id: number;
  courseRating: number;
  mentorRating: number;
  courseReview: string;
  mentorReview: string;
  subscriptionId: number;
  updatedAt: string;
  reviewer: ReviewerAccount;
  report?: FeedbackReportRESP;
}

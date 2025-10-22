import { Prisma } from '@prisma/client';
import { AccountRESP } from 'src/domains/accounts/response/account.response';
import { SubscriptionDetailRESP } from 'src/domains/subscription/dto/response/subscription-detail.response';
import { ReportFeedbackDetailRESP } from '../response/report-detail.response';

export type ReportGetPayload = Prisma.ReportGetPayload<{
  include: { Feedback: true; Reporter: true; Subscription: true };
}>;

export type ReporterAccountRESP = Pick<AccountRESP, 'id' | 'name' | 'thumbnail'>;

export type ReportRelationDetailRESP = {
  feedback?: ReportFeedbackDetailRESP;
  subscription?: SubscriptionDetailRESP;
};

export type ReportFeedbackListRESP = {
  id: number;
  courseRating: number;
  courseReview: string;
  mentorRating: number;
  mentorReview: string;
  updatedAt: string;
};

import { Prisma } from '@prisma/client';
import { AccountRESP } from 'src/domains/accounts/response/account.response';
import { ReportDetailRESP } from 'src/domains/report/response/report-detail.response';

export type ReviewerAccount = Pick<AccountRESP, 'id' | 'name' | 'thumbnail'>;

export type FeedbackGetPayload = Prisma.FeedbackGetPayload<{
  include: { Subscription: true; Reviewer: true; Report: true };
}>;

export enum FeedbackRelation {
  COURSE = 'COURSE',
  MENTOR = 'MENTOR',
}

export type FeedbackReportRESP = Pick<ReportDetailRESP, 'id' | 'type' | 'description' | 'status' | 'resolution'>;

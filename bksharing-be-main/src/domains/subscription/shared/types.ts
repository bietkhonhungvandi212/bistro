import { Prisma } from '@prisma/client';
import { FeedbackListRESP } from 'src/domains/feedback/response/feedback-list.response';
import { MentorClientDetailRESP } from 'src/domains/mentor/admin/response/mentor-client-detail.response';
import { ReportDetailRESP } from 'src/domains/report/response/report-detail.response';

export type SubscriptionGetPlayload = Prisma.SubscriptionGetPayload<{
  include: { Course: true; Account: true; Payment: true; AudioRoom: true; Feedback: true; Report: true };
}>;

export type SubscriptionMentorListRESP = Pick<MentorClientDetailRESP, 'id' | 'name' | 'thumbnail' | 'accountId'>;

export type SubscriptionFeedbackRESP = Pick<
  FeedbackListRESP,
  'id' | 'courseRating' | 'mentorRating' | 'courseReview' | 'mentorReview'
>;

export type SubscriptionReportRESP = Pick<ReportDetailRESP, 'id' | 'type' | 'description' | 'status' | 'resolution'>;

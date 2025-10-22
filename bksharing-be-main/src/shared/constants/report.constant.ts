import { NotificationType, ReportType } from '@prisma/client';

export const ReportNotificationMap = new Map<ReportType, NotificationType>([
  [ReportType.COURSE_UNQUALIFIED, NotificationType.COURSE_REPORTED],
  [ReportType.FEEDBACK_INAPPROPRIATE, NotificationType.FEEDBACK_REPORTED],
  [ReportType.MENTOR_ISSUES, NotificationType.MENTOR_REPORTED],
]);

export const REPORT_SUBSCRIPTION_TYPE: ReportType[] = [ReportType.COURSE_UNQUALIFIED, ReportType.MENTOR_ISSUES];
export const REPORT_FEEDBACK_TYPE: ReportType[] = [ReportType.FEEDBACK_INAPPROPRIATE];

export enum ReportSubscriptionPushnishment {
  MENTOR_SUSPENSION = 'MENTOR_SUSPENSION',
  COURSE_SUSPENSION = 'COURSE_SUSPENSION',
}

export const REPORT_DURATION_TIME_QUERY = 3 * 30 * 24 * 60 * 60;

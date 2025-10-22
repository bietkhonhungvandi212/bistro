import { SubscriptionListRESP } from 'src/domains/subscription/dto/response/subscription-list.response';

export type StatisticSubscriptionListRESP = Omit<
  SubscriptionListRESP,
  'audiCall' | 'feedback' | 'report' | 'canceledAt' | 'approvedAt' | 'rejectedAt'
>;

export type CourseTopRates = {
  courseId: number;
  courseName: string;
  avgRate?: number;
  noOfSubscription?: number;
};

export enum TopCourseType {
  TOP_RATE = 'TOP_RATE',
  TOP_NUMBER_OF_SUBSCRIPTION = 'TOP_NUMBER_OF_SUBSCRIPTION',
}

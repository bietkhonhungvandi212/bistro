import { SubscriptionStatus } from '@prisma/client';
import { AccountRESP } from 'src/domains/accounts/response/account.response';
import { parseEpoch } from 'src/shared/parsers/common.parser';
import { SubscriptionMentorListRESP } from '../../shared/types';

export class SubscriptionAdminListRESP {
  id: string;
  status: SubscriptionStatus;
  wageStatus: SubscriptionStatus;
  originalPrice: number;
  courseAccessStartAt: Date;
  courseAccessEndAt: Date;
  mentorInfo: SubscriptionMentorListRESP;
  studentInfo: AccountRESP;
  course: { id: number; name: string };

  static fromEntity(
    subscription: any,
    studentInfo: AccountRESP,
    mentorInfo: SubscriptionMentorListRESP,
  ): SubscriptionAdminListRESP {
    return {
      id: subscription.id,
      status: subscription.status,
      wageStatus: subscription.wageStatus,
      originalPrice: subscription.originalPrice,
      courseAccessStartAt: parseEpoch(subscription.courseAccessStartAt),
      courseAccessEndAt: parseEpoch(subscription.courseAccessEndAt),
      studentInfo: studentInfo,
      mentorInfo: mentorInfo,
      course: { id: subscription.Course.id, name: subscription.Course.name },
    };
  }
}

import { PaymentStatus, RoomStatus, SubscriptionStatus } from '@prisma/client';
import { AccountRESP } from 'src/domains/accounts/response/account.response';
import { parseDecimalNumber, parseEpoch } from 'src/shared/parsers/common.parser';
import { orNullWithCondition } from 'src/shared/parsers/io.parser';
import {
  SubscriptionFeedbackRESP,
  SubscriptionGetPlayload,
  SubscriptionMentorListRESP,
  SubscriptionReportRESP,
} from '../../shared/types';

export class SubscriptionCombinedListRESP {
  ids: number[];
  status: SubscriptionStatus;
  originalPrice: number;
  courseStartAt: string;
  courseEndAt: string;
  course: { id: number; name: string };
  audiCall: { status: RoomStatus; cid: string };

  static fromEntity(
    ids: number[],
    subcription: Partial<SubscriptionGetPlayload>,
    audiCall: { status: RoomStatus; cid: string },
  ): SubscriptionCombinedListRESP {
    return {
      ids: ids,
      status: subcription.status,
      originalPrice: parseDecimalNumber(subcription.originalPrice),
      courseStartAt: parseEpoch(subcription.courseAccessStartAt),
      courseEndAt: parseEpoch(subcription.courseAccessEndAt),
      course: { id: subcription.Course.id, name: subcription.Course.name },
      audiCall: audiCall,
    };
  }
}

export class SubscriptionListRESP {
  id: number;
  status: SubscriptionStatus;
  originalPrice: number;
  courseStartAt: string;
  courseEndAt: string;
  course: { id: number; name: string };
  mentorInfo: SubscriptionMentorListRESP;
  studentInfo: AccountRESP;
  audiCall: { status: RoomStatus; cid: string };
  payment?: { id: true; status: PaymentStatus; price: number };
  feedback?: SubscriptionFeedbackRESP;
  report?: SubscriptionReportRESP;
  canceledAt?: string;
  approvedAt?: string;
  rejectedAt?: string;

  static fromEntity(
    subcription: SubscriptionGetPlayload,
    studentInfo: AccountRESP,
    audiCall: { status: RoomStatus; cid: string },
    mentorInfo?: SubscriptionMentorListRESP,
  ): SubscriptionListRESP {
    return {
      id: subcription.id,
      status: subcription.status,
      originalPrice: parseDecimalNumber(subcription.originalPrice),
      courseStartAt: parseEpoch(subcription.courseAccessStartAt),
      courseEndAt: parseEpoch(subcription.courseAccessEndAt),
      canceledAt: parseEpoch(subcription.canceledAt),
      approvedAt: parseEpoch(subcription.approvedAt),
      rejectedAt: parseEpoch(subcription.rejectedAt),
      studentInfo: studentInfo,
      mentorInfo: mentorInfo,
      report: orNullWithCondition(!!subcription.Report, {
        id: subcription.Report?.id,
        type: subcription.Report?.type,
        description: subcription.Report?.description,
        status: subcription.Report?.status,
        resolution: subcription.Report?.resolution,
      }),
      course: { id: subcription.Course.id, name: subcription.Course.name },
      audiCall: audiCall,
      payment: orNullWithCondition(!!subcription.Payment, {
        id: subcription.Payment?.id,
        status: subcription.Payment?.status,
        price: parseDecimalNumber(subcription.Payment?.price),
      }),
      feedback: orNullWithCondition(!!subcription.Feedback, {
        id: subcription.Feedback?.id,
        courseRating: subcription.Feedback?.courseRating,
        mentorRating: subcription.Feedback?.mentorRating,
        courseReview: subcription.Feedback?.courseReview,
        mentorReview: subcription.Feedback?.mentorReview,
      }),
    };
  }
}

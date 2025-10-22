import { PaymentStatus, RoomStatus, SubscriptionStatus } from '@prisma/client';
import { AccountRESP } from 'src/domains/accounts/response/account.response';
import { CourseClientDetailRESP } from 'src/domains/course/client/response/course-client-detail.response';
import { FeedbackGetPayload } from 'src/domains/feedback/shared/type';
import { ImageRESP } from 'src/domains/image/response/image.response';
import { MentorClientDetailRESP } from 'src/domains/mentor/admin/response/mentor-client-detail.response';
import { MentorGetPayload } from 'src/domains/mentor/shared/types';
import { parseDecimalNumber, parseEpoch } from 'src/shared/parsers/common.parser';
import { orNullWithCondition } from 'src/shared/parsers/io.parser';
import { SubscriptionGetPlayload, SubscriptionReportRESP } from '../../shared/types';
export class SubscriptionFeedbackRESP {
  id: number;
  courseRating: number;
  mentorRating: number;
  courseReview: string;
  mentorReview: string;

  static fromEntity(e: FeedbackGetPayload): SubscriptionFeedbackRESP {
    return {
      id: e.id,
      courseRating: e.courseRating,
      mentorRating: e.mentorRating,
      courseReview: e.courseReview,
      mentorReview: e.mentorReview,
    };
  }
}

export class SubscriptionCombinedDetailRESP {
  ids: number[];
  status: SubscriptionStatus;
  orginalPrice: number;
  message: string;
  courseAccessStartAt: number;
  courseAccessEndAt: number;
  course: Pick<CourseClientDetailRESP, 'id' | 'name' | 'status' | 'description'>;
  mentor: Pick<MentorClientDetailRESP, 'id' | 'name' | 'thumbnail' | 'accountId'>;
  combinedStudents: { info: AccountRESP; feedback?: SubscriptionFeedbackRESP; report?: SubscriptionReportRESP }[];
  audiCall: { status: RoomStatus; cid: string };

  static fromEntity(
    e: SubscriptionGetPlayload,
    mentor: MentorGetPayload,
    ids: number[],
    students: { info: AccountRESP; feedback?: SubscriptionFeedbackRESP; report?: SubscriptionReportRESP }[],
    thumbnail?: ImageRESP,
  ): SubscriptionCombinedDetailRESP {
    return {
      ids: ids,
      status: e.status,
      orginalPrice: parseDecimalNumber(e.originalPrice),
      message: e.message,
      courseAccessStartAt: parseEpoch(e.courseAccessStartAt),
      courseAccessEndAt: parseEpoch(e.courseAccessEndAt),
      course: { id: e.Course.id, name: e.Course.name, status: e.Course.status, description: e.Course.description },
      mentor: { id: mentor.id, accountId: mentor.accountId, name: mentor.Account.name, thumbnail: thumbnail },
      audiCall: orNullWithCondition(!!e.AudioRoom, {
        status: e.AudioRoom?.status,
        cid: e.AudioRoom?.cid,
      }),
      combinedStudents: students,
    };
  }
}

export class SubscriptionDetailRESP {
  id: number;
  status: SubscriptionStatus;
  orginalPrice: number;
  message: string;
  courseAccessStartAt: number;
  courseAccessEndAt: number;
  course: Pick<CourseClientDetailRESP, 'id' | 'name' | 'status' | 'description'>;
  mentor: Pick<MentorClientDetailRESP, 'id' | 'name' | 'thumbnail' | 'accountId'>;
  student: AccountRESP;
  audiCall?: { status: RoomStatus; cid: string };
  report?: SubscriptionReportRESP;
  payment?: { status: PaymentStatus; price: number };

  static fromEntity(
    e: SubscriptionGetPlayload,
    mentor: MentorGetPayload,
    student: AccountRESP,
    thumbnail?: ImageRESP,
  ): SubscriptionDetailRESP {
    return {
      id: e.id,
      status: e.status,
      orginalPrice: parseDecimalNumber(e.originalPrice),
      message: e.message,
      courseAccessStartAt: parseEpoch(e.courseAccessStartAt),
      courseAccessEndAt: parseEpoch(e.courseAccessEndAt),
      course: { id: e.Course.id, name: e.Course.name, status: e.Course.status, description: e.Course.description },
      mentor: { id: mentor.id, accountId: mentor.accountId, name: mentor.Account.name, thumbnail: thumbnail },
      payment: orNullWithCondition(!!e.Payment, {
        status: e.Payment?.status,
        price: parseDecimalNumber(e.Payment?.price),
      }),
      audiCall: orNullWithCondition(!!e.AudioRoom, {
        status: e.AudioRoom?.status,
        cid: e.AudioRoom?.cid,
      }),
      report: orNullWithCondition(!!e.Report, {
        id: e.Report?.id,
        type: e.Report?.type,
        description: e.Report?.description,
        status: e.Report?.status,
        resolution: e.Report?.resolution,
      }),
      student: student,
    };
  }
}

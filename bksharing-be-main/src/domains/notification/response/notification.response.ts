import { Course, NotificationRelationType, NotificationType, Payment, Subscription } from '@prisma/client';
import { AudioRoomGetPayload } from 'src/domains/audio-call/shared/types';
import { ImageRESP } from 'src/domains/image/response/image.response';
import { MentorGetPayload } from 'src/domains/mentor/shared/types';
import { ActionFailed, ActionFailedException } from 'src/shared/exceptions/action-failed.exception';
import { parseDecimalNumber, parseEpoch } from 'src/shared/parsers/common.parser';
import { parsePrismaDateToEpoch } from 'src/shared/parsers/datetime.parse';
import { NotificationGetPayload } from '../shared/types';

//=======================Course=======================
export class NotificationCourseDetailRESP {
  id: number;
  name: string;
  price: number;
  startDate: string;
  endDate: string;

  static fromEntity(entity: Course): NotificationCourseDetailRESP {
    return {
      id: entity.id,
      name: entity.name,
      price: parseDecimalNumber(entity.price),
      startDate: parsePrismaDateToEpoch(entity.startDate),
      endDate: parsePrismaDateToEpoch(entity.endDate),
    };
  }
}

export type NotificationPaymentSubscriptionRESP = Pick<NotificationSubscriptionDetailRESP, 'id' | 'createdAt' | 'course'>;

//=======================Payment=======================
export class NotificationPaymentDetailRESP {
  id: number;
  price: number;
  status: string;
  createdAt: string;
  subscription: NotificationSubscriptionDetailRESP;

  static fromEntity(entity: Payment, subscription: NotificationPaymentSubscriptionRESP): NotificationPaymentDetailRESP {
    return {
      id: entity.id,
      status: entity.status,
      subscription,
      price: parseDecimalNumber(entity.price),
      createdAt: parseEpoch(entity.createdAt),
    };
  }
}

//=======================Mentor=======================
export class NotificationMentorDetailRESP {
  id: number;
  name: string;
  email: string;
  thumbnail?: ImageRESP;

  static fromEntity(entity: MentorGetPayload, thumbnail?: ImageRESP): NotificationMentorDetailRESP {
    return {
      id: entity.id,
      name: entity.Account.name,
      email: entity.Account.email,
      thumbnail,
    };
  }
}

//=======================Audio Room=======================
export class NotificationAudioRoomDetailRESP {
  id: number;
  title: string;
  startsAt: string;
  status: string;
  cid: string;

  static fromEntity(entity: AudioRoomGetPayload): NotificationAudioRoomDetailRESP {
    return {
      id: entity.id,
      title: entity.title,
      startsAt: parseEpoch(entity.startsAt),
      status: entity.status,
      cid: entity.cid,
    };
  }
}

//=======================Subscription=======================
export class NotificationSubscriptionDetailRESP {
  id: number;
  createdAt: string;
  course: NotificationCourseDetailRESP;
  payment?: NotificationPaymentDetailRESP;

  static fromEntity(
    entity: Subscription,
    course: NotificationCourseDetailRESP,
    payment: NotificationPaymentDetailRESP | null,
  ): NotificationSubscriptionDetailRESP {
    return {
      id: entity.id,
      course,
      payment,
      createdAt: parseEpoch(entity.createdAt),
    };
  }
}

//=======================FEEDBACK=======================
export class NotificationFeedbackDetailRESP {
  id: number;
  courseReview: string;
  courseRating: number;
  mentorReview: string;
  mentorRating: number;

  static fromEntity(entity: any): NotificationFeedbackDetailRESP {
    return {
      id: entity.id,
      courseReview: entity.courseReview,
      courseRating: entity.courseRating,
      mentorReview: entity.mentorReview,
      mentorRating: entity.mentorRating,
    };
  }
}

//=======================REPORT=======================
export class NotificationReportDetailRESP {
  id: number;
  status: string;
  resolution: string;
  subscription?: NotificationSubscriptionDetailRESP;
  feedback?: NotificationFeedbackDetailRESP;

  static fromEntity(
    entity: any,
    subscription: NotificationSubscriptionDetailRESP,
    feedback: NotificationFeedbackDetailRESP,
  ): NotificationReportDetailRESP {
    return {
      id: entity.id,
      status: entity.status,
      resolution: entity.resolution,
      subscription,
      feedback,
    };
  }
}

export type NotificationRelationRESP =
  | NotificationCourseDetailRESP
  | NotificationPaymentDetailRESP
  | NotificationSubscriptionDetailRESP
  | NotificationMentorDetailRESP
  | NotificationAudioRoomDetailRESP
  | NotificationFeedbackDetailRESP
  | NotificationReportDetailRESP;

export class NotificationRESP {
  id: number;
  title: string;
  content: string;
  isRead: boolean;
  type: NotificationType;
  relationType: NotificationRelationType;
  createdAt: string;
  readAt?: string;
  course?: NotificationCourseDetailRESP;
  payment?: NotificationPaymentDetailRESP;
  subscription?: NotificationSubscriptionDetailRESP;
  mentor?: NotificationMentorDetailRESP;
  audioRoom?: NotificationAudioRoomDetailRESP;
  feedback?: NotificationFeedbackDetailRESP;
  report?: NotificationReportDetailRESP;

  static fromEntity(e: NotificationGetPayload, relation: NotificationRelationRESP): NotificationRESP {
    const mappingRelation = this.mapRelationTypeToDetail(e.relationType, relation);
    return {
      id: e.id,
      title: e.title,
      content: e.content,
      isRead: e.isRead,
      type: e.type,
      relationType: e.relationType,
      readAt: parseEpoch(e.readAt),
      createdAt: parseEpoch(e.createdAt),
      ...mappingRelation,
    };
  }

  static mapRelationTypeToDetail(relationType: NotificationRelationType, relation: NotificationRelationRESP) {
    let mappingRelation: any;
    switch (relationType) {
      case NotificationRelationType.COURSE:
        mappingRelation = { course: relation as NotificationCourseDetailRESP };
        break;
      case NotificationRelationType.PAYMENT:
        mappingRelation = { payment: relation as NotificationPaymentDetailRESP };
        break;
      case NotificationRelationType.SUBSCRIPTION:
        mappingRelation = { subscription: relation as NotificationSubscriptionDetailRESP };
        break;
      case NotificationRelationType.MENTOR:
        mappingRelation = { mentor: relation as NotificationMentorDetailRESP };
        break;
      case NotificationRelationType.AUDIO_CALL:
        mappingRelation = { audioRoom: relation as NotificationAudioRoomDetailRESP };
        break;
      case NotificationRelationType.FEEDBACK:
        mappingRelation = { feedback: relation as NotificationFeedbackDetailRESP };
        break;
      case NotificationRelationType.REPORT:
        mappingRelation = { report: relation as NotificationReportDetailRESP };
        break;
      default:
        throw new ActionFailedException(ActionFailed.NOTIFICATION_INVALID_RELATION_TYPE);
    }

    return {
      course: null,
      payment: null,
      subscription: null,
      mentor: null,
      audioRoom: null,
      report: null,
      feedback: null,
      ...mappingRelation,
    };
  }
}

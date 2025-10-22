import { ReportStatus, ReportType } from '@prisma/client';
import { FeedbackListRESP } from 'src/domains/feedback/response/feedback-list.response';
import { SubscriptionDetailRESP } from 'src/domains/subscription/dto/response/subscription-detail.response';
import { ReportFeedbackListRESP } from '../shared/type';

export class ReportSubscriptionDetailRESP extends SubscriptionDetailRESP {
  audioCall: ReportAudioCallDetailRESP;
  feedbacks: ReportFeedbackListRESP[] = [];
}

export class ReportFeedbackDetailRESP extends FeedbackListRESP {}

export class ReportAudioCallDetailRESP {
  id: number;
  cid: string;
}

export class ReportDetailRESP {
  id: number;
  type: ReportType;
  description: string;
  status: ReportStatus;
  resolution: string;
  createdAt: string;
  subscription?: ReportSubscriptionDetailRESP;
  feedback?: ReportFeedbackDetailRESP;
}

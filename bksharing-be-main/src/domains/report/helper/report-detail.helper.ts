import { Feedback, Prisma } from '@prisma/client';
import { parseEpoch } from 'src/shared/parsers/common.parser';
import { orNullWithCondition } from 'src/shared/parsers/io.parser';
import { ReportDetailRESP, ReportFeedbackDetailRESP, ReportSubscriptionDetailRESP } from '../response/report-detail.response';
import { ReporterAccountRESP, ReportGetPayload, ReportRelationDetailRESP } from '../shared/type';

export class ReportDetailHelper {
  static toFindUnique(reportId: number): Prisma.ReportFindUniqueOrThrowArgs {
    return {
      where: { id: reportId },
      select: {
        id: true,
        type: true,
        description: true,
        status: true,
        resolution: true,
        createdAt: true,
        reporterId: true,
        subscriptionId: true,
        Feedback: {
          select: {
            id: true,
            reviewerId: true,
            courseRating: true,
            courseReview: true,
            mentorRating: true,
            mentorReview: true,
            subscriptionId: true,
            createdAt: true,
          },
        },
      },
    };
  }

  static fromReportFeedback(feedback: Feedback, reviewer: ReporterAccountRESP): ReportFeedbackDetailRESP {
    if (!feedback) return null;

    return {
      id: feedback.id,
      courseRating: feedback.courseRating,
      mentorRating: feedback.mentorRating,
      courseReview: feedback.courseReview,
      mentorReview: feedback.mentorReview,
      updatedAt: parseEpoch(feedback.updatedAt),
      reviewer: reviewer,
      subscriptionId: feedback.subscriptionId,
    };
  }

  static fromReportSubscription(subcription: ReportSubscriptionDetailRESP): ReportSubscriptionDetailRESP {
    if (!subcription) return null;

    return subcription;
  }

  static fromReportEntity(entity: ReportGetPayload, reportRelation: ReportRelationDetailRESP): ReportDetailRESP {
    return {
      id: entity.id,
      type: entity.type,
      description: entity.description,
      status: entity.status,
      resolution: entity.resolution,
      createdAt: parseEpoch(entity.createdAt),
      subscription: orNullWithCondition(!!reportRelation.subscription, reportRelation.subscription),
      feedback: orNullWithCondition(!!reportRelation.feedback, reportRelation.feedback),
    };
  }
}

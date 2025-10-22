import { Prisma, ReportStatus, ReportType } from '@prisma/client';
import { AuthUserDTO } from 'src/domains/auth/dto/auth-user.dto';
import { connectRelation } from 'src/shared/helpers/prisma.helper';
import { ReportCreateInterface } from '../shared/interface';

export class ReportCreateHelper {
  static toConnectRelationByReportType(type: ReportType, relationId: number) {
    switch (type) {
      case ReportType.MENTOR_ISSUES:
      case ReportType.COURSE_UNQUALIFIED:
        return { Subscription: connectRelation(relationId) };
      case ReportType.FEEDBACK_INAPPROPRIATE:
        return { Feedback: connectRelation(relationId) };
    }
  }

  static toCreate<T extends ReportCreateInterface>(user: AuthUserDTO, body: T): Prisma.ReportCreateArgs {
    const relationId = body['subscriptionId'] || body['feedbackId'];

    return {
      data: {
        type: body.type,
        description: body.description,
        status: ReportStatus.PENDING,
        Reporter: connectRelation(user.accountId),
        ...this.toConnectRelationByReportType(body.type, relationId),
      },
    };
  }
}

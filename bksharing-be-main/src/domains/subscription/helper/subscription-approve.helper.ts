import { Prisma, SubscriptionStatus } from '@prisma/client';
import { AuthUserDTO } from 'src/domains/auth/dto/auth-user.dto';
import { nowEpoch } from 'src/shared/helpers/common.helper';
import { SubscriptionMentorApproveREQ } from '../dto/request/subscription-mentor-approve';

export class SubscriptionApproveHelper {
  static toApprove(body: SubscriptionMentorApproveREQ, courseCreator: AuthUserDTO): Prisma.SubscriptionUpdateArgs {
    const timeUpdate = body.isApproved ? { approvedAt: nowEpoch() } : { rejectedAt: nowEpoch() };

    return {
      where: { id: body.subscriptionId, Course: { creatorId: courseCreator.accountId } },
      data: {
        status: body.isApproved ? SubscriptionStatus.ACCEPTED : SubscriptionStatus.REJECTED,
        ...timeUpdate,
      },
      select: { id: true, accountId: true, status: true },
    };
  }
}

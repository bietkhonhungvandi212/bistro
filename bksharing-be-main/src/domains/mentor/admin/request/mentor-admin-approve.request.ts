import { MentorStatus, Prisma } from '@prisma/client';
import { AuthUserDTO } from 'src/domains/auth/dto/auth-user.dto';
import { nowEpoch } from 'src/shared/helpers/common.helper';
import { connectRelation } from 'src/shared/helpers/prisma.helper';
import { BooleanValidator } from 'src/shared/request-validator/boolean.request-validator';

export class MentorAdminApproveREQ {
  @BooleanValidator()
  isApproved: boolean;

  static toApprove(id: number, body: MentorAdminApproveREQ, user: AuthUserDTO): Prisma.MentorUpdateArgs {
    return {
      where: { id },
      data: {
        status: body.isApproved ? MentorStatus.ACCEPTED : MentorStatus.REJECTED,
        Acceptant: connectRelation(user.accountId),
        accpetedAt: nowEpoch(),
      },
      select: { id: true, accountId: true },
    };
  }
}

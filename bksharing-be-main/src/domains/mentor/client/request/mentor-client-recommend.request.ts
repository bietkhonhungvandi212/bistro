import { AccountStatus, Prisma } from '@prisma/client';
import { IsArray } from 'class-validator';
import { ArrayNotDuplicated } from 'src/shared/request-validator/array-not-duplicated.request-validator';

export class MentorClientRecommendREQ {
  @ArrayNotDuplicated(Number)
  @IsArray()
  accountIds: number[] = [];

  static toFindManyByAccountIds(query: MentorClientRecommendREQ): Prisma.MentorFindManyArgs {
    return {
      where: { accountId: { in: query.accountIds }, Account: { status: AccountStatus.ACTIVE } },
      select: {
        id: true,
        accountId: true,
        meanRates: true,
        Account: { select: { name: true, avatarId: true, bio: true } },
      },
    };
  }
}

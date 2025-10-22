import { AccountType, Prisma, ReportStatus } from '@prisma/client';
import { AuthUserDTO } from 'src/domains/auth/dto/auth-user.dto';

export class SubscriptionDetailHelper {
  static toFindUnique(subscriptionId: number): Prisma.SubscriptionFindUniqueArgs {
    return {
      where: { id: subscriptionId },
      select: {
        id: true,
        status: true,
        originalPrice: true,
        message: true,
        courseAccessStartAt: true,
        courseAccessEndAt: true,
        Course: { select: { id: true, creatorId: true, name: true, status: true, description: true } },
        Account: { select: { id: true } },
        Report: { select: { id: true, type: true, description: true, status: true, resolution: true } },
        Payment: { select: { status: true, price: true } },
        AudioRoom: { select: { status: true, cid: true } },
      },
    };
  }

  static toFindUniqueWithAccount(user: AuthUserDTO, subscriptionId: number): Prisma.SubscriptionFindUniqueArgs {
    const reportCondition =
      user.accountType === AccountType.MENTOR
        ? {
            where: { status: ReportStatus.RESOLVED },
          }
        : undefined;

    return {
      where: { id: subscriptionId },
      select: {
        id: true,
        status: true,
        originalPrice: true,
        message: true,
        courseAccessStartAt: true,
        courseAccessEndAt: true,
        Course: { select: { id: true, creatorId: true, name: true, status: true, description: true } },
        Account: { select: { id: true } },
        Report: {
          ...reportCondition,
          select: { id: true, type: true, description: true, status: true, resolution: true },
        },
        Payment: { select: { status: true, price: true } },
        AudioRoom: { select: { id: true, status: true, cid: true } },
      },
    };
  }

  static toFindByAccount(user: AuthUserDTO, id: number): Prisma.SubscriptionFindManyArgs['where'] {
    switch (user.accountType) {
      case AccountType.STUDENT:
        return {
          accountId: user.accountId,
          id: id,
        };

      case AccountType.MENTOR:
        return {
          Course: {
            creatorId: user.accountId,
          },
          id: id,
        };
      case AccountType.ADMIN:
        return {};
      default:
    }
  }
}

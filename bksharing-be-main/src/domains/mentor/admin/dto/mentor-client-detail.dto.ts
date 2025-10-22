import { Prisma } from '@prisma/client';

export class MentorClientDetailDTO {
  static toFindByAccountId(accountId: number): Prisma.MentorFindUniqueOrThrowArgs {
    return {
      where: { accountId: accountId },
      select: {
        id: true,
        accountId: true,
        status: true,
        fileId: true,
        targetLevels: true,
        meanRates: true,
        Account: {
          select: {
            name: true,
            email: true,
            dob: true,
            gender: true,
            avatarId: true,
            bio: true,
          },
        },
      },
    };
  }

  static toFindFirst(mentorId: number): Prisma.MentorFindFirstOrThrowArgs {
    return {
      where: { id: mentorId },
      select: {
        id: true,
        accountId: true,
        status: true,
        fileId: true,
        targetLevels: true,
        meanRates: true,
        Account: {
          select: {
            name: true,
            email: true,
            dob: true,
            gender: true,
            avatarId: true,
            bio: true,
          },
        },
      },
    };
  }

  static toFindManyAchievementsByAccountId(accountId: number): Prisma.ProfileAchievementFindManyArgs {
    return {
      where: { accountId },
      select: {
        id: true,
        name: true,
        major: true,
        position: true,
        isCurrent: true,
        organization: true,
        startDate: true,
        endDate: true,
        type: true,
        description: true,
        createdAt: true,
      },
    };
  }
}

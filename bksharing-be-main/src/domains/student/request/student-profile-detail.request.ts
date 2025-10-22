import { Prisma } from '@prisma/client';

export class StudentProfileDetailREQ {
  static toFindByAccountId(accountId: number): Prisma.StudentFindFirstOrThrowArgs {
    return {
      where: { accountId: accountId },
      select: {
        id: true,
        accountId: true,
        educationalLevel: true,
        major: true,
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

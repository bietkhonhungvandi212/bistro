import { Prisma } from '@prisma/client';

export class MentorAdminDetailDTO {
  static toFindUnique(mentorId: number): Prisma.MentorFindUniqueOrThrowArgs {
    return {
      where: { id: mentorId },
      select: {
        id: true,
        accountId: true,
        status: true,
        accpetedAt: true,
        createdAt: true,
        fileId: true,
        targetLevels: true,
        Account: {
          select: {
            name: true,
            email: true,
            dob: true,
            gender: true,
            avatarId: true,
            phoneNumber: true,
          },
        },
      },
    };
  }

  static toFindManyAchievements(accountId: number): Prisma.ProfileAchievementFindManyArgs {
    return {
      where: { accountId },
      select: {
        id: true,
        name: true,
        major: true,
        position: true,
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

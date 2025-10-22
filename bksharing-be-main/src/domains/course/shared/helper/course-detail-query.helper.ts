import { Prisma } from '@prisma/client';
import { IS_ACTIVE_NESTED } from 'src/shared/constants/prisma.constant';

export class CourseDetailQueryHelper {
  static toFindUnique(id: number): Prisma.CourseFindUniqueOrThrowArgs {
    // const isCourseOwner = user.accountType === AccountType.MENTOR;

    // const creator = orUndefinedWithCondition(isCourseOwner, {
    //   creatorId: user.accountId,
    // });

    return {
      where: { id },
      select: {
        id: true,
        name: true,
        status: true,
        description: true,
        totalDuration: true,
        price: true,
        isPublic: true,
        startDate: true,
        endDate: true,
        objectives: true,
        targetAudiences: true,
        prerequisites: true,
        litmitOfStudents: true,
        creatorId: true,
        categoryId: true,
        createdAt: true,
        imageId: true,
        Category: { select: { id: true, name: true } },
        Sections: {
          where: { ...IS_ACTIVE_NESTED },
          orderBy: { ordinal: 'asc' },
          select: { id: true, title: true, description: true, ordinal: true, isPublic: true },
        },
        Creator: { select: { id: true, name: true } },
      },
    };
  }
}

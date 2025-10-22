import { AccountStatus, AccountType, CourseStatus, PaymentStatus, Prisma } from '@prisma/client';
import { AuthUserDTO } from 'src/domains/auth/dto/auth-user.dto';
import { IS_ACTIVE_NESTED } from 'src/shared/constants/prisma.constant';
import { QueryPagingHelper } from 'src/shared/helpers/pagination.helper';
import { defaultSortDesc } from 'src/shared/helpers/query.helper';
import { leanObject, parsePrismaSearch } from 'src/shared/parsers/common.parser';
import { orUndefinedWithCondition } from 'src/shared/parsers/io.parser';
import { CourseClientListREQ } from '../../factory/list/course-client-list.request';
import { CourseBaseListREQ } from '../course-base-list.request';
import { CourseSortableFields } from '../enums';

export class CourseListQueryHelper {
  static toFilterByAccountType = (user: AuthUserDTO): Prisma.CourseWhereInput => {
    switch (user.accountType) {
      case AccountType.ADMIN:
        return {};
      case AccountType.STUDENT:
        return {
          status: CourseStatus.APPROVED,
          Subscriptions: { some: { Account: { id: user.accountId, accountType: AccountType.STUDENT }, ...IS_ACTIVE_NESTED } },
        };
      case AccountType.MENTOR:
        return {
          OR: [
            { Creator: { id: user.accountId, accountType: AccountType.MENTOR } },
            { isPublic: true, status: CourseStatus.APPROVED },
          ],
        };
      default:
        return { isPublic: true, status: CourseStatus.APPROVED };
    }
  };

  static toQueryCondition = (query: CourseBaseListREQ): Prisma.CourseWhereInput => {
    const creatorName = orUndefinedWithCondition(!!query.creatorName, { Creator: parsePrismaSearch('name', query.creatorName) });
    const courseName = orUndefinedWithCondition(!!query.courseName, parsePrismaSearch('name', query.courseName));
    const targetAudiences = orUndefinedWithCondition(!!query.targetAudiences, {
      targetAudiences: { hasEvery: query.targetAudiences },
    });
    const categoryIds = orUndefinedWithCondition(!!query.categoryIds, {
      Category: { id: { in: query.categoryIds } },
    });

    return leanObject({
      status: query.courseStatus,
      ...courseName,
      ...creatorName,
      ...targetAudiences,
      ...categoryIds,
    });
  };

  static toOrderBy(query: CourseBaseListREQ): Prisma.CourseOrderByWithRelationInput {
    console.log('🚀 ~ CourseListQueryHelper ~ query:', query.sortBy);
    console.log('🚀 ~ CourseListQueryHelper ~ query:', query.sortOrder);
    if (!query.sortBy) return defaultSortDesc;

    switch (query.sortBy) {
      case CourseSortableFields.CREATOR_NAME:
        return { Creator: { name: query.sortOrder } };
      default:
        return { [query.sortBy]: query.sortOrder };
    }
  }

  static toListByCreatorId(creatorId: number, isOwner: boolean, query: CourseClientListREQ): Prisma.CourseFindManyArgs {
    const condition = isOwner ? this.toQueryCondition(query) : { status: CourseStatus.APPROVED };

    return {
      where: { Creator: { id: creatorId }, ...condition },
      orderBy: defaultSortDesc,
      select: {
        id: true,
        name: true,
        status: true,
        price: true,
        totalDuration: true,
        isPublic: true,
        startDate: true,
        endDate: true,
        objectives: true,
        targetAudiences: true,
        prerequisites: true,
        createdAt: true,
        imageId: true,

        Category: { select: { id: true, name: true } },
        Creator: { select: { id: true, name: true, email: true } },
        _count: { select: { Sections: true, Subscriptions: { where: { Payment: { status: PaymentStatus.DONE } } } } },
      },
    };
  }

  static toFindMany(query: CourseClientListREQ): Prisma.CourseFindManyArgs {
    const orderBy = CourseListQueryHelper.toOrderBy(query);
    const condition = CourseListQueryHelper.toQueryCondition(query);

    return {
      where: {
        ...condition,
        isPublic: true,
        status: CourseStatus.APPROVED,
        Creator: { status: { not: AccountStatus.SUSPENDED } },
      },
      orderBy,
      ...QueryPagingHelper.queryPaging(query),
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        totalDuration: true,
        litmitOfStudents: true,
        isPublic: true,
        startDate: true,
        endDate: true,
        objectives: true,
        targetAudiences: true,
        prerequisites: true,
        imageId: true,
        createdAt: true,
        meanRates: true,
        Category: { select: { id: true, name: true } },
        Creator: { select: { id: true, name: true, email: true, avatarId: true } },
        _count: { select: { Sections: true, Subscriptions: { where: { Payment: { status: PaymentStatus.DONE } } } } },
      },
    };
  }
}

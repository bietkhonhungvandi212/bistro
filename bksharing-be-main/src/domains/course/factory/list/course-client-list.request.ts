import { AccountStatus, PaymentStatus, Prisma } from '@prisma/client';
import { AuthUserDTO } from 'src/domains/auth/dto/auth-user.dto';
import { QueryPagingHelper } from 'src/shared/helpers/pagination.helper';
import { CourseBaseListREQ } from '../../shared/course-base-list.request';
import { CourseListQueryHelper } from '../../shared/helper/course-list-query.helper';

export class CourseClientListREQ extends CourseBaseListREQ {
  constructor(data: Partial<CourseClientListREQ>) {
    super();
    Object.assign(this, data);
  }

  toFindManyByAccount(user: AuthUserDTO, query: CourseClientListREQ): Prisma.CourseFindManyArgs {
    const filterByAccount = CourseListQueryHelper.toFilterByAccountType(user);
    const condition = { ...CourseListQueryHelper.toQueryCondition(query), ...filterByAccount };
    const orderBy = CourseListQueryHelper.toOrderBy(query);

    return {
      where: { ...condition, Creator: { status: { not: AccountStatus.SUSPENDED } } },
      orderBy,
      ...QueryPagingHelper.queryPaging(query),
      select: {
        id: true,
        name: true,
        totalDuration: true,
        isPublic: true,
        startDate: true,
        endDate: true,
        objectives: true,
        targetAudiences: true,
        prerequisites: true,
        createdAt: true,
        imageId: true,
        meanRates: true,
        Category: { select: { id: true, name: true } },
        Creator: { select: { id: true, name: true, email: true } },
        _count: { select: { Sections: true, Subscriptions: { where: { Payment: { status: PaymentStatus.DONE } } } } },
      },
    };
  }
}

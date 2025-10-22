import { CourseStatus, Prisma } from '@prisma/client';
import { CATEGORY_DEFAULT_LEVEL } from 'src/shared/constants/category.constant';
import { IS_ACTIVE_NESTED } from 'src/shared/constants/prisma.constant';

type CategoryClientStatisticsCountProduct = {
  _count: {
    Products: number;
  };
};

export type CategoryClientStatisticsCountPayload = Prisma.CategoryGetPayload<{
  include: { ChildrenCategories: true };
}> &
  CategoryClientStatisticsCountProduct;

export class CategoryClientStatisticsDTO {
  static toFindMany(): Prisma.CategoryFindManyArgs {
    return {
      where: { level: CATEGORY_DEFAULT_LEVEL },
      select: {
        id: true,
        name: true,
        level: true,
        ChildrenCategories: {
          select: {
            id: true,
            name: true,
            level: true,
            _count: {
              select: { Courses: { where: { status: CourseStatus.APPROVED, ...IS_ACTIVE_NESTED } } },
            },
          },
          where: IS_ACTIVE_NESTED,
        },
      },
    };
  }
}

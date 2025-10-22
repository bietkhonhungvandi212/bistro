import { Prisma } from '@prisma/client';
import { IsEnum, IsOptional, ValidateIf } from 'class-validator';
import { MAX_CATEGORY_LEVEL } from 'src/shared/constants/category.constant';
import { SortOrder } from 'src/shared/enums/query.enum';
import { PaginationREQ } from 'src/shared/generics/pagination.request';
import { QueryPagingHelper } from 'src/shared/helpers/pagination.helper';
import { leanObject } from 'src/shared/parsers/common.parser';
import { orUndefinedWithCondition } from 'src/shared/parsers/io.parser';
import { BooleanValidator } from 'src/shared/request-validator/boolean.request-validator';
import { CategorySortableFields } from '../../shared/enums';

export class CategoryClientListREQ extends PaginationREQ {
  @BooleanValidator()
  @IsOptional()
  isRecommended: boolean;

  @IsOptional()
  @IsEnum(CategorySortableFields)
  sortBy?: CategorySortableFields;

  @IsOptional()
  @IsEnum(SortOrder)
  @ValidateIf((o) => o.sortBy)
  sortOrder: SortOrder = SortOrder.ASC;

  static toQueryCondition(query: CategoryClientListREQ): Prisma.CategoryWhereInput {
    const recommendedCategoryFiltered = orUndefinedWithCondition(query.isRecommended, {
      level: MAX_CATEGORY_LEVEL,
      isRecommended: true,
    });
    return leanObject({ ...recommendedCategoryFiltered });
  }

  static toOrderBy(
    query: CategoryClientListREQ,
  ): Prisma.CategoryOrderByWithRelationInput | Prisma.CategoryOrderByWithRelationInput[] {
    if (!query.sortBy) return [{ level: SortOrder.ASC }, { ordinal: SortOrder.ASC }];
    return { [query.sortBy]: query.sortOrder };
  }

  static toFindMany(query: CategoryClientListREQ): Prisma.CategoryFindManyArgs {
    const orderBy = this.toOrderBy(query);
    const condition = this.toQueryCondition(query);
    return {
      where: condition,
      include: { Courses: true },
      ...QueryPagingHelper.queryPaging(query),
      orderBy: orderBy,
    };
  }
}

import { Prisma } from '@prisma/client';
import { IsEnum, IsOptional, IsString, ValidateIf } from 'class-validator';
import { IS_ACTIVE_NESTED } from 'src/shared/constants/prisma.constant';
import { SortOrder } from 'src/shared/enums/query.enum';
import { PaginationREQ } from 'src/shared/generics/pagination.request';
import { QueryPagingHelper } from 'src/shared/helpers/pagination.helper';
import { parsePrismaSearch } from 'src/shared/parsers/common.parser';
import { orUndefinedWithCondition } from 'src/shared/parsers/io.parser';
import { CategorySortableFields } from '../../shared/enums';

export class CategoryAdminListREQ extends PaginationREQ {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(CategorySortableFields)
  sortBy?: CategorySortableFields;

  @IsOptional()
  @IsEnum(SortOrder)
  @ValidateIf((o) => o.sortBy)
  sortOrder: SortOrder = SortOrder.ASC;

  static toOrderBy(
    query: CategoryAdminListREQ,
  ): Prisma.CategoryOrderByWithAggregationInput | Prisma.CategoryOrderByWithAggregationInput[] {
    if (!query.sortBy) return [{ level: SortOrder.ASC }, { ordinal: SortOrder.ASC }];
    return { [query.sortBy]: query.sortOrder };
  }

  static toQueryCondition(query: CategoryAdminListREQ) {
    const searchName = orUndefinedWithCondition(!!query.name, parsePrismaSearch('name', query.name));
    return {
      ...searchName,
    } as Prisma.CategoryFindManyArgs['where'];
  }

  static toFindMany(query: CategoryAdminListREQ): Prisma.CategoryFindManyArgs {
    const orderBy = this.toOrderBy(query);
    const condition: Prisma.CategoryFindManyArgs['where'] = this.toQueryCondition(query);
    return {
      ...QueryPagingHelper.queryPaging(query),
      where: condition,
      orderBy,
      include: { Courses: { where: IS_ACTIVE_NESTED } },
    };
  }
}

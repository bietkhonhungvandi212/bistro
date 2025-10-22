import { AccountStatus, AccountType, MentorStatus, Prisma } from '@prisma/client';
import { IsEnum, IsOptional, IsString, ValidateIf } from 'class-validator';
import { SortOrder } from 'src/shared/enums/query.enum';
import { PaginationREQ } from 'src/shared/generics/pagination.request';
import { QueryPagingHelper } from 'src/shared/helpers/pagination.helper';
import { defaultSortDesc } from 'src/shared/helpers/query.helper';
import { leanObject, parsePrismaSearch } from 'src/shared/parsers/common.parser';
import { orUndefinedWithCondition } from 'src/shared/parsers/io.parser';
import { MentorAdminListSortableFields } from '../../shared/enums';

export class MentorClientListREQ extends PaginationREQ {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsEnum(MentorStatus)
  @IsOptional()
  status?: MentorStatus;

  @IsEnum(MentorAdminListSortableFields)
  @IsOptional()
  sortBy?: MentorAdminListSortableFields;

  @IsEnum(SortOrder)
  @ValidateIf((o) => o.sortBy)
  @IsOptional()
  sortOrder: SortOrder = SortOrder.DESC;

  static toQueryCondition(query: MentorClientListREQ): Prisma.MentorWhereInput {
    const nameSearch = orUndefinedWithCondition(!!query.name, parsePrismaSearch('name', query.name));
    const emailSearch = orUndefinedWithCondition(!!query.email, parsePrismaSearch('email', query.email));

    const phoneNumberSearch = orUndefinedWithCondition(!!query.phoneNumber, parsePrismaSearch('phoneNumber', query.phoneNumber));

    return leanObject({
      Account: {
        ...nameSearch,
        ...emailSearch,
        ...phoneNumberSearch,
        status: AccountStatus.ACTIVE,
        accountType: AccountType.MENTOR,
      },
      status: query.status,
    });
  }

  static toOrderBy(query: MentorClientListREQ): Prisma.MentorOrderByWithRelationInput {
    if (!query.sortBy) return defaultSortDesc;

    switch (query.sortBy) {
      case MentorAdminListSortableFields.NAME:
        return {
          Account: {
            name: query.sortOrder,
          },
        };
      case MentorAdminListSortableFields.EMAIL:
        return {
          Account: {
            email: query.sortOrder,
          },
        };
      case MentorAdminListSortableFields.PHONE_NUMBER:
        return {
          Account: {
            phoneNumber: query.sortOrder,
          },
        };
      default:
        return { [query.sortBy]: query.sortOrder };
    }
  }

  static toFindMany(query: MentorClientListREQ): Prisma.MentorFindManyArgs {
    const condition = this.toQueryCondition(query);
    const orderBy = this.toOrderBy(query);

    return {
      where: { ...condition },
      ...QueryPagingHelper.queryPaging(query),
      orderBy: orderBy,
      select: {
        id: true,
        accountId: true,
        meanRates: true,
        Account: { select: { name: true, avatarId: true, bio: true } },
      },
    };
  }
}

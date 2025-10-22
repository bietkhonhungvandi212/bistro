import { NotificationScope, Prisma } from '@prisma/client';
import { IsOptional } from 'class-validator';
import { AuthUserDTO } from 'src/domains/auth/dto/auth-user.dto';
import { PaginationREQ } from 'src/shared/generics/pagination.request';
import { QueryPagingHelper } from 'src/shared/helpers/pagination.helper';
import { defaultSortDesc } from 'src/shared/helpers/query.helper';
import { BooleanValidator } from 'src/shared/request-validator/boolean.request-validator';

export class NotificationListREQ extends PaginationREQ {
  @BooleanValidator()
  @IsOptional()
  isRead?: boolean;

  static toQueryCondition(user: AuthUserDTO, query: NotificationListREQ): Prisma.NotificationWhereInput {
    return {
      isRead: query.isRead,
      OR: [
        { scopes: { has: NotificationScope.INDIVIDUAL }, targetAccountId: user.accountId },
        { scopes: { has: NotificationScope.ALL } },
      ],
    };
  }
  static toFindMany(user: AuthUserDTO, query: NotificationListREQ): Prisma.NotificationFindManyArgs {
    const condition = NotificationListREQ.toQueryCondition(user, query);

    return {
      where: condition,
      ...QueryPagingHelper.queryPaging(query),
      orderBy: defaultSortDesc,
      include: { TargetAccount: true },
    };
  }
}

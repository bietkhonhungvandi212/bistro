import { AccountType, Prisma } from '@prisma/client';
import { AuthUserDTO } from 'src/domains/auth/dto/auth-user.dto';
import { QueryPagingHelper } from 'src/shared/helpers/pagination.helper';
import { parseEpoch, parsePrismaSearch } from 'src/shared/parsers/common.parser';
import { orUndefinedWithCondition } from 'src/shared/parsers/io.parser';
import { ReportListREQ } from '../request/report-list.request';
import { ReportListRESP } from '../response/report-list.response';
import { ReportGetPayload } from '../shared/type';

export class ReportListHelper {
  static toFilterByAccountType(user: AuthUserDTO): Prisma.ReportWhereInput {
    switch (user.accountType) {
      case AccountType.STUDENT: {
        return { Reporter: { id: user.accountId } };
      }
      case AccountType.ADMIN: {
        return {};
      }
    }
  }

  static toQueryCondition(user: AuthUserDTO, query: ReportListREQ): Prisma.ReportWhereInput {
    const filterByAccountType = this.toFilterByAccountType(user);
    const queryName = orUndefinedWithCondition(!!query.reporterName, {
      Reporter: parsePrismaSearch('name', query.reporterName),
    });

    return {
      AND: [filterByAccountType, queryName].filter((x) => !!x),
      status: orUndefinedWithCondition(!!query.status, query.status),
      type: orUndefinedWithCondition(!!query.type, query.type),
    };
  }

  static toFindMany(user: AuthUserDTO, query: ReportListREQ): Prisma.ReportFindManyArgs {
    const queryCondition = this.toQueryCondition(user, query);
    console.log('🚀 ~ ReportListHelper ~ toFindMany ~ queryCondition:', queryCondition);

    return {
      where: { ...queryCondition },
      ...QueryPagingHelper.queryPaging(query),
      select: {
        id: true,
        type: true,
        description: true,
        status: true,
        resolution: true,
        createdAt: true,
        Reporter: { select: { id: true, name: true } },
      },
    };
  }

  static fromEntity(entity: ReportGetPayload): ReportListRESP {
    return {
      id: entity.id,
      type: entity.type,
      description: entity.description,
      status: entity.status,
      resolution: entity.resolution,
      reporter: { id: entity.Reporter.id, name: entity.Reporter.name },
      createdAt: parseEpoch(entity.createdAt),
    };
  }
}

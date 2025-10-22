import { Prisma } from '@prisma/client';
import { AccountRESP } from 'src/domains/accounts/response/account.response';
import { SubscriptionGetPlayload, SubscriptionMentorListRESP } from 'src/domains/subscription/shared/types';
import { QueryPagingHelper } from 'src/shared/helpers/pagination.helper';
import { parseDecimalNumber, parseEpoch } from 'src/shared/parsers/common.parser';
import { orNullWithCondition } from 'src/shared/parsers/io.parser';
import { StatisticSubscriptionListREQ } from '../request/statistic-subscription-list.request';
import { StatisticSubscriptionListRESP } from '../shared/types';

export class StatisticSubscriptionListHelper {
  static toFindMany(query: StatisticSubscriptionListREQ): Prisma.SubscriptionFindManyArgs {
    return {
      ...QueryPagingHelper.queryPaging(query),
      select: {
        id: true,
        status: true,
        originalPrice: true,
        courseAccessStartAt: true,
        courseAccessEndAt: true,
        Course: { select: { id: true, name: true, creatorId: true } },
        Payment: { select: { id: true, status: true, price: true } },
        Account: { select: { id: true } },
      },
    };
  }

  static fromEntity(
    e: SubscriptionGetPlayload,
    studentInfo: AccountRESP,
    mentorInfo?: SubscriptionMentorListRESP,
  ): StatisticSubscriptionListRESP {
    return {
      id: e.id,
      status: e.status,
      originalPrice: parseDecimalNumber(e.originalPrice),
      courseStartAt: parseEpoch(e.courseAccessStartAt),
      courseEndAt: parseEpoch(e.courseAccessEndAt),
      studentInfo: studentInfo,
      mentorInfo: mentorInfo,
      course: { id: e.Course.id, name: e.Course.name },
      payment: orNullWithCondition(!!e.Payment, {
        id: e.Payment?.id,
        status: e.Payment?.status,
        price: parseDecimalNumber(e.Payment?.price),
      }),
    };
  }
}

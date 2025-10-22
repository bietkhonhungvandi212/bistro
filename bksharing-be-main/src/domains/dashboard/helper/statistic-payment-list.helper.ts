import { PaymentStatus, Prisma } from '@prisma/client';
import { StatisticPaymentListREQ } from '../request/statistic-payment-list.request';

export class StatisticPaymentListHelper {
  static toQueryPaymentCondition(query: StatisticPaymentListREQ, beginDate: number, endDate: number): Prisma.PaymentWhereInput {
    const paymentStatus = !!query.status ? query.status : PaymentStatus.DONE;

    return {
      status: paymentStatus,
      AND: [{ createdAt: { gte: beginDate } }, { createdAt: { lte: endDate } }],
    };
  }

  static toAggregate(query: StatisticPaymentListREQ, beginDate: number, endDate: number): Prisma.PaymentAggregateArgs {
    const condition = this.toQueryPaymentCondition(query, beginDate, endDate);

    return {
      where: condition,
      _sum: { price: true },
    };
  }

  static toAggregateByAccountId(
    accountId: number,
    query: StatisticPaymentListREQ,
    beginDate: number,
    endDate: number,
  ): Prisma.PaymentAggregateArgs {
    const condition = this.toQueryPaymentCondition(query, beginDate, endDate);

    return {
      where: { ...condition, Subscription: { Course: { creatorId: accountId } } },
      _sum: { price: true },
    };
  }
}

import { Prisma, SubscriptionStatus } from '@prisma/client';
import { Nil } from 'src/shared/generics/type.helper';
import { connectRelation } from 'src/shared/helpers/prisma.helper';
import { parseEpochToDate } from 'src/shared/parsers/datetime.parse';
import { orUndefinedWithCondition } from 'src/shared/parsers/io.parser';

export class SubscriptionMakePaymentHelper {
  static toActivate(
    subscriptionId: number,
    subscriptionStatus: SubscriptionStatus,
    callId: number,
  ): Prisma.SubscriptionUpdateArgs {
    const audioRoom = orUndefinedWithCondition(subscriptionStatus === SubscriptionStatus.ACTIVE, {
      AudioRoom: connectRelation(callId),
    });

    return {
      where: { id: subscriptionId },
      data: { status: subscriptionStatus, ...audioRoom },
      select: { id: true },
    };
  }

  static parseAudioCallStartsAt(epoch: Nil<number>): string {
    if (!epoch) return;
    const [year, month, day, hour, minute, second] = parseEpochToDate(epoch)
      .split(/[-:\s]/)
      .map((value) => parseInt(value, 10));

    console.log(year, month, day, hour, minute, second); // Output: 2024 12 16 19 0 0

    // parse date time in this format DD/MM/YY to YYYY-MM-dd
    const parsedDate = `${day}/${month}/${year} ${hour}:${minute}:${second}`;
    return parsedDate;
  }
}

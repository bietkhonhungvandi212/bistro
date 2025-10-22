import { Prisma } from '@prisma/client';
import { IsBoolean } from 'class-validator';
import { nowEpoch } from 'src/shared/helpers/common.helper';
import { orUndefinedWithCondition } from 'src/shared/parsers/io.parser';

export class NotificationReadREQ {
  @IsBoolean()
  isRead: boolean; // true is marked as read, false is marked as unread

  static toReadNotification(id: number, body: NotificationReadREQ): Prisma.NotificationUpdateArgs {
    return {
      where: { id: id },
      data: { isRead: body.isRead, readAt: orUndefinedWithCondition(body.isRead, nowEpoch()) },
      select: { id: true, isRead: true },
    };
  }
}

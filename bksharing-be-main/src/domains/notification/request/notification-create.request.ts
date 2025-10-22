import { NotificationRelationType, NotificationScope, NotificationType, Prisma } from '@prisma/client';
import { IsArray, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { getNotificationMessage } from 'src/shared/constants/notification.constant';
import { connectRelation } from 'src/shared/helpers/prisma.helper';
import { IdValidator } from 'src/shared/request-validator/id.validator';

export class NotificationCreateREQ {
  @IsEnum(NotificationType)
  type: NotificationType;

  @IsEnum(NotificationRelationType)
  relationType: NotificationRelationType;

  @IdValidator()
  relationId: number;

  @IsEnum(NotificationScope)
  @IsArray()
  @IsOptional()
  scopes?: NotificationScope[];

  @IsNumber()
  @IsOptional()
  targetAccountId?: number;

  static toCreateNotification(body: NotificationCreateREQ): Prisma.NotificationCreateArgs {
    return {
      data: {
        type: body.type,
        scopes: body.scopes,
        relationType: body.relationType,
        relationId: body.relationId,
        title: getNotificationMessage(body.type).title,
        content: getNotificationMessage(body.type).content,
        TargetAccount: connectRelation(body.targetAccountId),
      },
      select: { id: true, targetAccountId: true },
    };
  }
}

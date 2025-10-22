import { NotificationRelationType, NotificationScope, NotificationType } from '@prisma/client';
import { getNotificationMessage } from 'src/shared/constants/notification.constant';
import { NotificationAppHandlerPayload } from '../shared/types';

type RelationData = {
  id: number;
  type: NotificationRelationType;
};

export class NotificationHelper {
  static makeAppNotificationPayload(
    relation: RelationData,
    targetAccountId: number,
    notificationType: NotificationType,
    scopes: NotificationScope[] = [NotificationScope.INDIVIDUAL],
  ): NotificationAppHandlerPayload {
    const message = getNotificationMessage(notificationType);

    return {
      notificationREQ: {
        relationId: relation.id,
        relationType: relation.type,
        type: notificationType,
        scopes: scopes,
        targetAccountId,
      },
      data: {
        title: message.title,
        topic: notificationType,
        body: message.content,
      },
    };
  }
}

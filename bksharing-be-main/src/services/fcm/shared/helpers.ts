import { NotificationType } from '@prisma/client';
import { FcmNotificationPayload } from 'src/domains/notification/shared/interfaces';

// adapter for the FCM service
export const payloadFcmAdapter = (
  title: string | NotificationType,
  topic: string | NotificationType,
  body: string | object,
): FcmNotificationPayload => {
  return {
    title: typeof title === 'string' ? title : NotificationType[title],
    topic: typeof topic === 'string' ? topic : NotificationType[topic],
    body: typeof body === 'object' ? JSON.stringify(body) : body,
  };
};

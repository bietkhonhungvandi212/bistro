import { Prisma } from '@prisma/client';
import { EmailPayload, EmailTemplate } from 'src/services/email/shared/types';
import { NotificationCreateREQ } from '../request/notification-create.request';

export type NotificationGetPayload = Prisma.NotificationGetPayload<{
  include: {
    TargetAccount: true;
  };
}>;

export interface BaseNotificationPayload {
  type?: string;
  userId?: string;
}

export interface FCMNotificationPayload extends BaseNotificationPayload {
  title: string;
  topic: string;
  body: string;
  [key: string]: any; // Additional properties for custom data
}

export interface NotificationEmailPayload {
  data: EmailPayload;
  template?: EmailTemplate;
}

export enum NotificationChannel {
  EMAIL = 'notification.email',
  SMS = 'notification.sms',
  APP = 'notification.app',
}

export interface NotificationPayload<TNotification, TData> {
  notificationREQ: TNotification;
  data: TData;
  eviceTokenCondition?: Prisma.DeviceTokenWhereInput;
}

export type NotificationAppHandlerPayload = NotificationPayload<NotificationCreateREQ, FCMNotificationPayload>;

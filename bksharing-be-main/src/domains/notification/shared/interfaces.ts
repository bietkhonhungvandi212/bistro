export interface BaseNotificationPayload {
  type?: string;
  userId?: string;
}

export interface FcmNotificationPayload extends BaseNotificationPayload {
  title: string;
  body: string;
  [key: string]: any; // Additional properties for custom data
}

export interface FCMSendOptions {
  token?: string;
  topic?: string;
  condition?: string;
  data?: { [key: string]: string }; // Custom data
}

export interface SESEmailPayload extends BaseNotificationPayload {
  to: string;
  subject?: string;
  template?: string;
  context?: any;
}

export interface SmsPayload extends BaseNotificationPayload {
  to: string;
  message: string;
}

// export interface NotificationPayload<TNotification, TData> {
//   notificationREQ: TNotification;
//   data: TData;
//   deviceTokenCondition?: Prisma.DeviceTokenWhereInput;
// }

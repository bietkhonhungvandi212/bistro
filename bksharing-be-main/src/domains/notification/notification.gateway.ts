import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EmailService } from 'src/services/email/email.service';
import { FCMService } from 'src/services/fcm/fcm.service';
import { payloadFcmAdapter } from 'src/services/fcm/shared/helpers';
import { NotificationService } from './notification.service';
import {
  NotificationAppHandlerPayload,
  NotificationChannel,
  NotificationEmailPayload,
  NotificationGetPayload,
} from './shared/types';

@Injectable()
export class NotificationGateway {
  private readonly logger = new Logger(NotificationGateway.name);
  constructor(
    private readonly fcmService: FCMService,
    private readonly emailService: EmailService,
    // private readonly smsService: SmsService,
    private readonly notificationService: NotificationService,
  ) {}

  @OnEvent(NotificationChannel.EMAIL)
  async handleEmailNotification(payload: NotificationEmailPayload) {
    await this.emailService.sendMail(payload.data, payload.template);
  }

  @OnEvent(NotificationChannel.APP)
  async handleAppNotification(payload: NotificationAppHandlerPayload) {
    this.logger.log('🚀 ~ NotificationGateway ~ handleAppNotification ~ payload:', payload);

    const notification = (await this.notificationService.createNotification(payload.notificationREQ)) as NotificationGetPayload;
    const detail = await this.notificationService.detail(notification.id);
    this.logger.log('🚀 ~ NotificationGateway ~ handleAppNotification ~ detail:', detail);

    const data = payloadFcmAdapter(payload.data.title, payload.data.topic, detail);
    const condition = payload.data.condition ?? { accountId: notification.targetAccountId };
    this.logger.log('🚀 ~ NotificationGateway ~ handleAppNotification ~ condition:', condition);
    await this.fcmService.sendNotificationToAllDevices(notification.targetAccountId, condition, data);
  }

  // @OnEvent(NotificationChannel.SMS)
  // handleSmsNotification(payload: SmsPayload) {
  //   this.smsService.sendSMS(payload);
  // }
}

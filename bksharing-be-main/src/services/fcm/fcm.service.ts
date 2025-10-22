import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as firebaseAdmin from 'firebase-admin';
import { Message } from 'firebase-admin/lib/messaging/messaging-api';
import { isEmpty } from 'lodash';
import { FIREBASE_CLOUD_MESSAGE_CERTIFICATION } from 'src/app.config';
import { AuthUserDTO } from 'src/domains/auth/dto/auth-user.dto';
import { FcmNotificationPayload, FCMSendOptions } from 'src/domains/notification/shared/interfaces';
import { TRANSACTION_TIMEOUT } from 'src/shared/constants/prisma.constant';
import { resolvePathFromRoot } from 'src/shared/helpers/path.helper';
import { PrismaRawService } from '../prisma/prisma-raw.service';
import { TransactionHost } from '../prisma/transactions/transaction-host';
import { Transactional } from '../prisma/transactions/transactional.decorator';
import { FcmRegisterTokenREQ } from './request/fcm-register-token.request';
import { FcmRemoveTokenREQ } from './request/fcm-remove-token.request';

@Injectable()
export class FCMService {
  private readonly logger = new Logger(FCMService.name);

  constructor(
    private readonly transactionHost: TransactionHost,
    private readonly prismaRawService: PrismaRawService,
  ) {
    try {
      const resolvedPath = resolvePathFromRoot(FIREBASE_CLOUD_MESSAGE_CERTIFICATION);
      this.logger.log('🚀 ~ FCMService ~ resolvedPath:', resolvedPath);

      firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert(resolvedPath),
      });
      this.logger.log('Firebase Admin initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Firebase Admin', error);
      throw new Error('Firebase initialization failed');
    }
  }

  private notificationMessageBuilder(payload: FcmNotificationPayload, options: FCMSendOptions) {
    const message: Message = {
      notification: {
        title: payload.title,
        body: payload.body,
      },
      data: options.data || {},
      ...(options.token && { token: options.token }),
      // ...(options.topic && { topic: options.topic }),
      // ...(options.condition && { condition: options.condition }),
    };
    return message;
  }

  async sendNotification(payload: FcmNotificationPayload, options: FCMSendOptions): Promise<string> {
    try {
      const message = this.notificationMessageBuilder(payload, options);
      const response = await firebaseAdmin.messaging().send(message);
      this.logger.log('PUSHING NOTIFICATION SUCCESS on DEVICE', message.token);
      return response;
    } catch (error) {
      this.logger.error('PUSHING NOTIFICATION FAILED:', error);
      // throw new ActionFailedException(ActionFailed.NOTIFICATION_PUSH_FAILED, 'Error sending notification:', error);
    }
  }

  @Transactional(TRANSACTION_TIMEOUT)
  async sendNotificationToAllDevices(
    accountId: number,
    condition: Prisma.DeviceTokenWhereInput,
    payload: FcmNotificationPayload,
  ) {
    if (!accountId) {
      this.logger.error('Account ID is required to send notification');
      return;
    }

    const deviceTokens = await this.transactionHost.tx.deviceToken.findMany({
      where: condition,
      select: { token: true },
    });

    if (isEmpty(deviceTokens)) {
      this.logger.log('🚀 ~ FCMService ~ condition:', condition);
      this.logger.warn('🚀 ~ FCMService ~ deviceTokens ~ there no tokens:', deviceTokens);
      return;
    }

    for (const device of deviceTokens) {
      await this.sendNotification(
        { body: typeof payload.body === 'object' ? JSON.stringify(payload.body) : payload.body, title: payload.title },
        { token: device.token },
      );
    }
  }

  async registerToken(user: AuthUserDTO, body: FcmRegisterTokenREQ) {
    const exiestedToken = await this.transactionHost.tx.deviceToken.findUnique({
      where: { token: body.token },
      select: { id: true },
    });

    if (exiestedToken) return exiestedToken;

    const token = await this.transactionHost.tx.deviceToken.create(FcmRegisterTokenREQ.toCreateToken(user.accountId, body));

    return token;
  }

  async removeToken(user: AuthUserDTO, body: FcmRemoveTokenREQ) {
    const deviceToken = await this.transactionHost.tx.deviceToken.findUniqueOrThrow({
      where: { token: body.token },
      select: { accountId: true, id: true },
    });

    // if (deviceToken && deviceToken.accountId !== user.accountId) throw new ForbiddenException();

    await this.prismaRawService.deviceToken.delete({ where: { token: body.token } });
  }
}

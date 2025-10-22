import { Injectable, Logger } from '@nestjs/common';
import {
  AudioRoomType,
  NotificationRelationType,
  NotificationType,
  ParticipantAudioRoomRole,
  PaymentStatus,
  RoomStatus,
  SubscriptionStatus,
} from '@prisma/client';
import { randomUUID } from 'crypto';
import { AudioCallAdminCreateREQ } from 'src/domains/audio-call/admin/request/audio-call-admin-create.request';
import { NotificationHelper } from 'src/domains/notification/helper/notification-common.helper';
import { NotificationAppHandlerPayload, NotificationChannel } from 'src/domains/notification/shared/types';
import { SubscriptionMakePaymentHelper } from 'src/domains/subscription/helper/subscription-make-payment.helper';
import { SubscriptionGetPlayload } from 'src/domains/subscription/shared/types';
import { EventEmitterService } from 'src/services/event-emitter/event-emitter.service';
import { ReturnQueryFromVNPay } from 'src/services/payment-gateway/vn-pay/shared/vnpay.type';
import { VnpayService } from 'src/services/payment-gateway/vn-pay/vnpay.service';
import { TransactionHost } from 'src/services/prisma/transactions/transaction-host';
import { Transactional } from 'src/services/prisma/transactions/transactional.decorator';
import { ReturnPaymentStatus } from 'src/shared/constants/payment.constant';
import { TRANSACTION_TIMEOUT } from 'src/shared/constants/prisma.constant';
import { EXPIRED_SUBSCRIPTION_AFTER_APPROVED } from 'src/shared/constants/subscription.constant';
import { ActionFailed, ActionFailedException } from 'src/shared/exceptions/action-failed.exception';
import { Result } from 'src/shared/generics/type.helper';
import { addCreationTimestamps } from 'src/shared/helpers/add-timestamp.helper';
import { nowEpoch, runFunctionWithCondition } from 'src/shared/helpers/common.helper';
import { connectRelation } from 'src/shared/helpers/prisma.helper';
import { parseDecimalNumber, parseEpoch } from 'src/shared/parsers/common.parser';
import { PaymentContinueREQ } from '../dto/payment-continue.request';
import { PaymentCreateREQ } from '../dto/payment-create.request';

@Injectable()
export class PaymentClientService {
  private logger = new Logger(PaymentClientService.name);
  constructor(
    private readonly transactionHost: TransactionHost,
    private readonly vnpayService: VnpayService,
    private readonly eventEmitterService: EventEmitterService,
  ) {}

  @Transactional(TRANSACTION_TIMEOUT)
  async create(body: PaymentCreateREQ, ipAddr: string): Promise<any> {
    const payment = await this.transactionHost.tx.payment.create({
      data: {
        status: PaymentStatus.IN_PROGRESS,
        price: parseDecimalNumber(body.amount),
        Subscription: connectRelation(body.subscriptionId),
      },
      select: {
        id: true,
        status: true,
      },
    });

    const url = await this.vnpayService.create(payment.id, PaymentCreateREQ.toVnpayRequest(body, ipAddr));

    return { payment, url };
  }

  @Transactional(TRANSACTION_TIMEOUT)
  async continue(body: PaymentContinueREQ, ipAddr: string): Promise<any> {
    const payment = await this.transactionHost.tx.payment.findUniqueOrThrow({
      where: { subscriptionId: body.subscriptionId },
      select: { id: true, status: true },
    });

    if (payment.status !== PaymentStatus.IN_PROGRESS) {
      throw new ActionFailedException(ActionFailed.PAYMENT_NOT_AVAILABLE);
    }

    const url = await this.vnpayService.create(payment.id, PaymentCreateREQ.toVnpayRequest(body, ipAddr));

    return { payment, url };
  }

  @Transactional(TRANSACTION_TIMEOUT)
  async verify(paymentId: number, query: ReturnQueryFromVNPay): Promise<Result<ReturnQueryFromVNPay, Error>> {
    const payment = await this.transactionHost.tx.payment.findUniqueOrThrow({
      where: { id: paymentId },
      select: { subscriptionId: true },
    });

    const subscription = await this.transactionHost.tx.subscription.findUniqueOrThrow({
      where: { id: payment.subscriptionId },
      select: {
        id: true,
        mentorScheduleId: true,
        status: true,
        approvedAt: true,
        accountId: true,
        Course: { select: { id: true, creatorId: true } },
      },
    });

    const now = nowEpoch();

    if (subscription.status !== SubscriptionStatus.ACCEPTED) {
      throw new ActionFailedException(ActionFailed.SUBSCRIPTION_NOT_AVAILABLE);
    }

    if (now - parseEpoch(subscription.approvedAt) > EXPIRED_SUBSCRIPTION_AFTER_APPROVED) {
      this.logger.log(
        '🚀 ~ PaymentClientService ~ verify ~ EXPIRED_SUBSCRIPTION_AFTER_APPROVED: ',
        EXPIRED_SUBSCRIPTION_AFTER_APPROVED,
      );

      this.logger.warn(
        `🚀 ~ PaymentClientService ~ verify ~ Subscription ${subscription.id} expired because not make payment after approved around 1 day`,
      );

      await this.updatePaymentStatus(paymentId, PaymentStatus.EXPIRED, SubscriptionStatus.EXPIRED);
    }

    const result = await this.vnpayService.verifyReturnUrl(paymentId, query);

    if (result.success == false) {
      this.logger.error('🚀 ~ PaymentClientService ~ verify ~ fail result:', result);
      this.logger.warn('🚀 ~ PaymentClientService ~ verify ~ fail query from third party');
      // await this.transactionHost.tx.payment.update({
      //   where: { id: paymentId },
      //   data: {
      //     status: PaymentStatus.CANCELED,
      //     Subscription: { update: { status: SubscriptionStatus.CANCELED } },
      //   },
      // });

      return result;
    }

    switch (result.data.vnp_ResponseCode) {
      case ReturnPaymentStatus.SUCCESSFUL_STATUS:
        const { payment } = await this.updatePaymentStatus(paymentId, PaymentStatus.DONE, SubscriptionStatus.ACTIVE);

        const payload = NotificationHelper.makeAppNotificationPayload(
          { id: payment.id, type: NotificationRelationType.PAYMENT },
          subscription.Course.creatorId,
          NotificationType.PAYMENT_SUCCESS,
        );

        runFunctionWithCondition(!!subscription, () => {
          this.eventEmitterService.emit<NotificationAppHandlerPayload>(NotificationChannel.APP, payload);
        });

        break;
      // case ReturnPaymentStatus.EXPIRED_STATUS:
      // await this.updatePaymentStatus(paymentId, PaymentStatus.EXPIRED, SubscriptionStatus.EXPIRED);
      // break;
      default:
        break;
    }

    return result;
  }

  async updatePaymentStatus(paymentId: number, status: PaymentStatus, subscriptionStatus: SubscriptionStatus) {
    const payment = await this.transactionHost.tx.payment.update({
      where: { id: paymentId },
      data: { status },
      select: {
        id: true,
        Subscription: {
          select: {
            id: true,
            accountId: true,
            courseAccessStartAt: true,
            courseId: true,
            Course: { select: { name: true, creatorId: true } },
          },
        },
      },
    });

    let cid: string;
    let callId: number;
    if (subscriptionStatus === SubscriptionStatus.ACTIVE) {
      const existedSubscription = await this.transactionHost.tx.subscription.findFirst({
        where: {
          courseId: payment.Subscription.courseId,
          courseAccessStartAt: payment.Subscription.courseAccessStartAt,
          status: SubscriptionStatus.ACTIVE,
        },
        select: { id: true, AudioRoom: { select: { id: true, cid: true } } },
      });

      if (existedSubscription) {
        callId = existedSubscription.AudioRoom?.id;
        cid = existedSubscription.AudioRoom?.cid;
        this.logger.log(
          '🚀 ~ PaymentClientService ~ updatePaymentStatus ~ The information of audio room will be reused by the available the subscription for the course with same datetime:',
          existedSubscription,
        );

        await this.transactionHost.tx.audioRoomParticipant.create({
          data: addCreationTimestamps({
            AudioRoom: connectRelation(callId),
            Account: connectRelation(payment.Subscription.accountId),
            isInCall: false,
            role: ParticipantAudioRoomRole.USER,
          }),
        });
      } else {
        callId = await this.createAudioCall(payment.Subscription as SubscriptionGetPlayload);
        cid = await this.generateCid(callId);
      }
    }

    (await this.transactionHost.tx.subscription.update(
      SubscriptionMakePaymentHelper.toActivate(payment.Subscription.id, subscriptionStatus, callId),
    )) as SubscriptionGetPlayload;

    return { payment, cid };
  }

  private async createAudioCall(subscription: SubscriptionGetPlayload): Promise<number> {
    const audioCallCreateData: AudioCallAdminCreateREQ = {
      title: `${subscription.Course.name}`,
      status: RoomStatus.SCHEDULED,
      type: AudioRoomType.AUDIOROOM,
      members: [{ accountId: subscription.accountId, role: ParticipantAudioRoomRole.USER }],
      startsAt: SubscriptionMakePaymentHelper.parseAudioCallStartsAt(Number(subscription.courseAccessStartAt)),
    };

    const call = await this.transactionHost.tx.audioRoom.create(
      AudioCallAdminCreateREQ.toCreateMemberInput(subscription.Course.creatorId, audioCallCreateData),
    );

    return call.id;
  }

  // Function to generate CID
  private async generateCid(callId: number): Promise<string> {
    const cid = `${new Date().getTime()}-${callId}-${randomUUID()}`;

    await this.transactionHost.tx.audioRoom.update({
      where: { id: callId },
      data: { cid: cid },
      select: { id: true },
    });
    return cid;
  }
}

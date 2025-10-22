import { Injectable, Logger } from '@nestjs/common';
import {
  AudioRoomParticipant,
  AudioRoomType,
  ChatRoomType,
  NotificationRelationType,
  NotificationType,
  ParticipantAudioRoomRole,
  RoomStatus,
  SubscriptionStatus,
} from '@prisma/client';
import { isEmpty } from 'class-validator';
import { EventEmitterService } from 'src/services/event-emitter/event-emitter.service';
import { TransactionHost } from 'src/services/prisma/transactions/transaction-host';
import { Transactional } from 'src/services/prisma/transactions/transactional.decorator';
import { AUDIO_ROOM_CONSTANT, AudioRoomActivity } from 'src/shared/constants/audio-room.constant';
import { COMMON_CONSTANT } from 'src/shared/constants/common.constant';
import { TRANSACTION_TIMEOUT } from 'src/shared/constants/prisma.constant';
import { ActionFailed, ActionFailedException } from 'src/shared/exceptions/action-failed.exception';
import { nowEpoch, runFunctionWithCondition } from 'src/shared/helpers/common.helper';
import { asyncSome } from 'src/shared/helpers/function.helper';
import { connectRelation } from 'src/shared/helpers/prisma.helper';
import { AudioCallErrorMessages } from 'src/shared/messages/error-messages';
import { parseEpoch } from 'src/shared/parsers/common.parser';
import { AuthUserDTO } from '../auth/dto/auth-user.dto';
import { ChatMessageService } from '../chat-message/chat-message.service';
import { ImageService } from '../image/image.service';
import { NotificationHelper } from '../notification/helper/notification-common.helper';
import { NotificationAppHandlerPayload, NotificationChannel } from '../notification/shared/types';
import { AudioCallEndDTO } from './dto/audio-call-end.dto';
import { AudioCallJoinDTO } from './dto/audio-call-join.dto';
import { AudioCallStartDTO } from './dto/audio-call-start.dto';
import { AudioCallParticipantHistoryRESP } from './response/audio-call-participant-history.response';
import { AudioRoomActivityHistoryGetPayload, AudioRoomGetPayload } from './shared/types';

@Injectable()
export class AudioCallService {
  private readonly logger = new Logger(AudioCallService.name);
  constructor(
    private readonly transactionHost: TransactionHost,
    private readonly imageService: ImageService,
    private readonly chatMessageService: ChatMessageService,
    private readonly eventEmitterService: EventEmitterService,
  ) {}

  @Transactional(TRANSACTION_TIMEOUT)
  async getAudioCallHistory(audioRoomId: number) {
    await this.checkExistedRoom(audioRoomId);
    const histories = await this.transactionHost.tx.audioRoomActivityHistory.findMany({
      where: { AudioRoomParticipant: { roomId: audioRoomId } },
      select: {
        id: true,
        joinedAt: true,
        leftAt: true,
        AudioRoomParticipant: { select: { accountId: true, role: true, Account: { select: { avatarId: true } } } },
      },
    });

    return await Promise.all(
      histories.map(async (history: AudioRoomActivityHistoryGetPayload) => {
        const thumbnail = await this.imageService.getImageOriginal(history.AudioRoomParticipant?.Account?.avatarId);
        const account = await this.transactionHost.tx.account.findFirst({
          where: { id: history.AudioRoomParticipant.accountId },
          select: { name: true },
        });

        return AudioCallParticipantHistoryRESP.fromEntity(history, {
          name: account.name,
          thumbnail,
        });
      }),
    );
  }

  async getAudioCallParticipants(audioRoomId: number) {
    const participants = await this.transactionHost.tx.audioRoomParticipant.findMany({
      where: { roomId: audioRoomId },
      select: { accountId: true, role: true, isInCall: true },
    });

    return participants;
  }

  @Transactional(TRANSACTION_TIMEOUT)
  async startAudioCall(user: AuthUserDTO, roomId: number) {
    this.logger.log('🚀 ~ AudioCallService ~ startAudioCall ~ user:', user.accountId);
    /* Check existed call */
    const call = await this.checkExistedRoom(roomId);

    /* Check user is belong to participant list and user has role 'ADMIN' */
    const havePermissionToStart = await asyncSome<AudioRoomParticipant>(call.Participants, async (participant) => {
      const isInOtherCall = await this.checkAccountInCall(participant.accountId, roomId);
      this.logger.log('🚀 ~ AudioCallService ~ havePermissionToStart ~ isInOtherCall:', isInOtherCall);

      const tmp =
        participant.accountId === user.accountId &&
        participant.role === ParticipantAudioRoomRole.ADMIN &&
        !participant.isInCall &&
        !isInOtherCall;

      return tmp;
    });

    if (!havePermissionToStart) {
      throw new ActionFailedException(ActionFailed.CALL_AUDIO_NOT_HAVE_PERMISSION, AudioCallErrorMessages.MSG02);
    }

    /* Check status of audio call */
    if (call.status === (RoomStatus.FINISHED || RoomStatus.CANCELLED)) {
      throw new ActionFailedException(ActionFailed.CALL_INVALID, AudioCallErrorMessages.MSG04);
    }

    /* Update status of call & participant started call */
    const updatedCall = await this.transactionHost.tx.audioRoom.update(AudioCallStartDTO.toStart(user, roomId));

    const accountIds = call.Participants.map((participant) => participant.accountId);

    /* Create a chat message room for audio call participants */
    const chatRoomId = await this.chatMessageService.createChatRoom({
      chatRoomType: ChatRoomType.GROUP,
      audioRoomId: roomId,
      accountIds: accountIds,
    });
    this.logger.log('🚀 ~ AudioCallService ~ startAudioCall ~ chatRoomId:', chatRoomId);

    // Push notification to all participants
    for (const accountId of accountIds) {
      if (accountId !== user.accountId) {
        const payload = NotificationHelper.makeAppNotificationPayload(
          { id: updatedCall.id, type: NotificationRelationType.AUDIO_CALL },
          accountId,
          NotificationType.AUDIO_CALL_STARTED,
        );

        runFunctionWithCondition(!!updatedCall.id, () => {
          this.eventEmitterService.emit<NotificationAppHandlerPayload>(NotificationChannel.APP, payload);
        });
      }
    }

    return updatedCall;
  }

  @Transactional(TRANSACTION_TIMEOUT)
  async endAudioCall(user: AuthUserDTO, roomId: number) {
    const call = await this.checkExistedRoom(roomId);

    /* Check user is belong to participant list and user has role 'ADMIN' */
    const canEndCall = call.Participants.some(
      (participant) => participant.accountId === user.accountId && participant.role === ParticipantAudioRoomRole.ADMIN,
    );

    if (!canEndCall) {
      throw new ActionFailedException(ActionFailed.CALL_AUDIO_NOT_HAVE_PERMISSION, AudioCallErrorMessages.MSG03);
    }

    /* Check status of audio call */
    if (call.status === (RoomStatus.FINISHED || RoomStatus.CANCELLED)) {
      throw new ActionFailedException(ActionFailed.CALL_INVALID, AudioCallErrorMessages.MSG04);
    }

    const now = nowEpoch();
    let updatedCall: any;
    if (!isEmpty(call.Subscriptions)) {
      await Promise.all(
        call.Subscriptions.map(async (subscription) => {
          const courseAccessStartAt = parseEpoch(subscription.courseAccessStartAt);
          const courseAccessEndAt = parseEpoch(subscription.courseAccessEndAt);

          if (now > courseAccessStartAt && now < courseAccessEndAt) {
            throw new ActionFailedException(ActionFailed.CALL_AUDIO_CAN_NOT_CANCEL, AudioCallErrorMessages.MSG07);
          } else {
            const subcription = await this.transactionHost.tx.subscription.update({
              where: { id: subscription.id },
              data: { status: SubscriptionStatus.ENDED },
              select: { id: true },
            });

            this.logger.log(`🚀 ~ AudioCallService ~ endAudioCall ~ the subscription with id ${subcription.id} ended `);
          }
        }),
      );

      updatedCall = await this.transactionHost.tx.audioRoom.update(AudioCallEndDTO.toEnd(roomId));

      // if (now > courseAccessStartAt && now < courseAccessEndAt) {
      //   throw new ActionFailedException(ActionFailed.CALL_AUDIO_CAN_NOT_CANCEL, AudioCallErrorMessages.MSG07);
      // } else if (now < courseAccessStartAt) {
      //   this.logger.log(`🚀 ~ AudioCallService ~ endAudioCall ~ the subscription with id ${call.Subscription.id} have started`);
      //   updatedCall = await this.transactionHost.tx.audioRoomParticipant.updateMany({
      //     where: { roomId: roomId, isInCall: true },
      //     data: { isInCall: false },
      //   });
      // } else {
      //   const subcription = await this.transactionHost.tx.subscription.update({
      //     where: { id: call.Subscription.id },
      //     data: { status: SubscriptionStatus.ENDED, wageStatus: WageStatus.FULL_WAGE },
      //     select: { id: true },
      //   });

      //   this.logger.log(`🚀 ~ AudioCallService ~ endAudioCall ~ the subscription with id ${subcription.id} ended `);
      //   updatedCall = await this.transactionHost.tx.audioRoom.update(AudioCallEndDTO.toEnd(roomId));
      // }

      /* Update status of call & participant started call */
      await this.transactionHost.tx.audioRoomParticipant.updateMany({
        where: { roomId: roomId, isInCall: true },
        data: { isInCall: false },
      });
    } else if (call.type === AudioRoomType.INTERVIEW) {
      updatedCall = await this.transactionHost.tx.audioRoom.update(AudioCallEndDTO.toEnd(roomId));

      await this.transactionHost.tx.audioRoomParticipant.updateMany({
        where: { roomId: roomId, isInCall: true },
        data: { isInCall: false },
      });
    }

    const callId = updatedCall ? updatedCall.id : roomId;

    await this.transactionHost.tx.audioRoomActivityHistory.updateMany({
      where: { AudioRoomParticipant: { roomId: callId }, leftAt: AUDIO_ROOM_CONSTANT.DEFAULT_VALUE_LEFT_AT },
      data: { leftAt: nowEpoch() },
    });

    return updatedCall;
  }

  @Transactional(TRANSACTION_TIMEOUT)
  async joinAudioCall(user: AuthUserDTO, roomId: number) {
    const call = await this.checkExistedRoom(roomId);
    const isInCall = await this.checkAccountInCall(user.accountId, roomId);

    const isPartipated = call.Participants.some(
      (participant) => participant.accountId === user.accountId && !participant.isInCall,
    );

    if (isInCall) {
      throw new ActionFailedException(ActionFailed.CALL_AUDIO_CAN_NOT_JOIN, AudioCallErrorMessages.MSG05);
    } else if (!call.isPublic && !isPartipated) {
      throw new ActionFailedException(ActionFailed.CALL_AUDIO_CAN_NOT_JOIN, AudioCallErrorMessages.MSG06);
    }

    if (call.status === (RoomStatus.FINISHED || RoomStatus.CANCELLED)) {
      throw new ActionFailedException(ActionFailed.CALL_INVALID, AudioCallErrorMessages.MSG04);
    }

    const updatedCall = await this.transactionHost.tx.audioRoom.update({
      where: { id: roomId },
      data: { activeParticipantCount: { increment: COMMON_CONSTANT.DEFAULT_INCREMENT } },
      select: { id: true },
    });

    await this.transactionHost.tx.audioRoomParticipant.upsert(AudioCallJoinDTO.toUpsertParticipant(user, roomId));
    await this.createPaticipantHistory(user.accountId, updatedCall.id, AudioRoomActivity.JOIN);

    return updatedCall;
  }

  @Transactional(TRANSACTION_TIMEOUT)
  async leaveAudioCall(accountId: number, roomId: number) {
    /* Check existed audio room */
    const call = await this.checkExistedRoom(roomId);
    const participants = await this.getAllParticipants(roomId);

    /* Check if user is joinning the audio room */
    const isPartipated = participants.some((participant) => participant.accountId === accountId && participant.isInCall);

    if (!isPartipated) {
      this.logger.error(`🚀 ~ AudioCallService ~ leaveAudioCall ~ the user with id ${accountId} is not in call`);
      throw new ActionFailedException(ActionFailed.CALL_AUDIO_CAN_NOT_LEAVE);
    }

    /* Check the status of room */
    if (call.status === (RoomStatus.FINISHED || RoomStatus.CANCELLED)) {
      this.logger.error(`🚀 ~ AudioCallService ~ leaveAudioCall ~ the call status is invalid`);
      throw new ActionFailedException(ActionFailed.CALL_INVALID, AudioCallErrorMessages.MSG04);
    }

    /* We must decrement the number of participant */
    const updatedCall = await this.transactionHost.tx.audioRoom.update({
      where: { id: roomId },
      data: { activeParticipantCount: { decrement: COMMON_CONSTANT.DEFAULT_DECREMENT } },
      select: { id: true },
    });

    await this.transactionHost.tx.audioRoomParticipant.update({
      where: { roomId_accountId: { roomId: updatedCall.id, accountId: accountId } },
      data: { isInCall: false },
      select: { roomId: true },
    });

    await this.createPaticipantHistory(accountId, updatedCall.id, AudioRoomActivity.LEAVE);

    return updatedCall;
  }

  async createPaticipantHistory(accountId: number, roomId: number, type: AudioRoomActivity) {
    if (!accountId || !roomId) {
      this.logger.error(`🚀 ~ AudioCallService ~ createPaticipantHistory ~ invalid accountId or roomId`);
      throw new ActionFailedException(ActionFailed.CALL_INVALID);
    }

    const participant = await this.transactionHost.tx.audioRoomParticipant.findFirst({
      where: { accountId, roomId },
      select: { id: true },
    });

    if (!participant) {
      this.logger.error(`🚀 ~ AudioCallService ~ createPaticipantHistory ~ the participant is not existed`);
      throw new ActionFailedException(ActionFailed.CALL_PARTICIPANT_NOT_FOUND);
    }

    //Find the lastest record of participant
    const lastestRecord = await this.transactionHost.tx.audioRoomActivityHistory.findFirst({
      where: { leftAt: AUDIO_ROOM_CONSTANT.DEFAULT_VALUE_LEFT_AT, audioRoomParticipantId: participant.id },
      select: { id: true },
    });
    this.logger.log('🚀 ~ AudioCallService ~ createPaticipantHistory ~ lastestRecord:', lastestRecord);

    if (type === AudioRoomActivity.JOIN) {
      //If the lastest record is existed with joinedAt but not leftAt
      // then the user is already in call
      if (lastestRecord) {
        throw new ActionFailedException(ActionFailed.CALL_PARTICIPANT_JOINED, AudioCallErrorMessages.MSG08);
      }

      await this.transactionHost.tx.audioRoomActivityHistory.create({
        data: {
          AudioRoomParticipant: connectRelation(participant.id),
          joinedAt: nowEpoch(),
        },
      });
    } else {
      // If the lastest record is existed with joinedAt but not leftAt
      // Then we will update the leftAt field
      await this.transactionHost.tx.audioRoomActivityHistory.update({
        where: { id: lastestRecord.id },
        data: { leftAt: nowEpoch() },
      });
    }
  }

  @Transactional(TRANSACTION_TIMEOUT)
  async cancelCall(roomId: number) {
    const call = await this.checkExistedRoom(roomId);

    if (call.status === RoomStatus.FINISHED || call.status === RoomStatus.ONGOING) {
      throw new ActionFailedException(ActionFailed.CALL_INVALID, AudioCallErrorMessages.MSG04);
    }

    const updatedCall = await this.transactionHost.tx.audioRoom.update({
      where: { id: roomId },
      data: { status: RoomStatus.CANCELLED },
      select: { id: true },
    });

    return updatedCall;
  }

  private async checkExistedRoom(roomId: number): Promise<AudioRoomGetPayload> {
    const call = (await this.transactionHost.tx.audioRoom.findFirst({
      where: { id: roomId },
      select: {
        id: true,
        status: true,
        type: true,
        isPublic: true,
        Subscriptions: { select: { id: true, courseAccessStartAt: true, courseAccessEndAt: true } },
        Participants: { select: { accountId: true, isInCall: true, role: true } },
        activeParticipantCount: true,
      },
    })) as AudioRoomGetPayload;

    if (!call) {
      throw new ActionFailedException(ActionFailed.CALL_NOT_FOUND);
    }

    return call;
  }

  private async checkAccountInCall(accountId: number, roomId: number): Promise<boolean> {
    const call = await this.transactionHost.tx.audioRoomParticipant.findFirst({
      where: {
        accountId,
        isInCall: true,
        roomId: { not: roomId },
        AudioRoom: { status: RoomStatus.ONGOING },
      },
      select: { roomId: true },
    });

    console.log('🚀 ~ AudioCallService ~ checkAccountInCall ~ isInCall:', call);

    return !!call;
  }

  private async getAllParticipants(roomId: number) {
    const participants = await this.transactionHost.tx.audioRoomParticipant.findMany({
      where: { roomId },
      select: { accountId: true, role: true, isInCall: true },
    });

    return participants;
  }
}

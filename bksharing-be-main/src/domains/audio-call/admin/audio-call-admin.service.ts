import { Injectable } from '@nestjs/common';
import { FileService } from 'src/domains/file/file.service';
import { TransactionHost } from 'src/services/prisma/transactions/transaction-host';
import { Transactional } from 'src/services/prisma/transactions/transactional.decorator';
import { TRANSACTION_TIMEOUT } from 'src/shared/constants/prisma.constant';
import { AuthUserDTO } from '../../auth/dto/auth-user.dto';
import { ImageService } from '../../image/image.service';
import { participantMapper } from '../shared/helpers';
import { AudioRoomGetPayload, AudioRoomParticipantGetPayload } from '../shared/types';
import { AudioCallAdminDetailDTO } from './dto/audio-call-admin-detail.dto';
import { AudioCallAdminCreateREQ } from './request/audio-call-admin-create.request';
import { AudioCallAdminListREQ } from './request/audio-call-admin-list.request';
import { AudioCallAdminDetailRESP } from './response/audio-call-admin-detail.response';
import { AudioCallAdminListRESP } from './response/audio-call-admin-list.response';

@Injectable()
export class AudioCallAdminService {
  constructor(
    private readonly transactionHost: TransactionHost,
    private readonly imageService: ImageService,
    private readonly fileService: FileService,
  ) {}

  @Transactional(TRANSACTION_TIMEOUT)
  async createAudioCall(user: AuthUserDTO, body: AudioCallAdminCreateREQ) {
    const call = await this.transactionHost.tx.audioRoom.create(AudioCallAdminCreateREQ.toCreateInput(user, body));
    console.log('🚀 ~ AudioCallAdminService ~ createAudioCall ~ call:', call);

    return call;
  }

  async list(user: AuthUserDTO, query: AudioCallAdminListREQ) {
    const calls = await this.transactionHost.tx.audioRoom.findMany(AudioCallAdminListREQ.toFindMany(query, user));
    const count = await this.transactionHost.tx.audioRoom.count({ where: AudioCallAdminListREQ.toQueryCondition(query, user) });

    const callDTOs = await Promise.all(
      calls.map(async (call: AudioRoomGetPayload) => {
        const participants = (await this.transactionHost.tx.audioRoomParticipant.findMany(
          AudioCallAdminListREQ.toFindManyParticipants(call.id),
        )) as AudioRoomParticipantGetPayload[];
        const participantDtos = await participantMapper(
          participants,
          this.imageService,
          this.fileService,
          this.transactionHost,
          true,
        );

        return AudioCallAdminListRESP.fromEntity(call, participantDtos);
      }),
    );
    const data = { callDTOs, count };

    return data;
  }

  async detail(roomId: number) {
    const call = (await this.transactionHost.tx.audioRoom.findFirstOrThrow(
      AudioCallAdminDetailDTO.toFindFirst(roomId),
    )) as AudioRoomGetPayload;

    const participants = (await this.transactionHost.tx.audioRoomParticipant.findMany(
      AudioCallAdminDetailDTO.toFindManyParticipants(roomId),
    )) as AudioRoomParticipantGetPayload[];

    const participantDTOs = await participantMapper(
      participants,
      this.imageService,
      this.fileService,
      this.transactionHost,
      true,
    );

    return AudioCallAdminDetailRESP.fromEntity(call, participantDTOs);
  }

  // @Transactional(TRANSACTION_TIMEOUT)
  // async joinAudioCall(user: AuthUserDTO, roomId: number) {
  //   const call = await this.transactionHost.tx.audioRoom.findFirstOrThrow({
  //     where: { id: roomId },
  //     select: { id: true, status: true, isPublic: true, Participants: { select: { accountId: true, isInCall: true } } },
  //   });

  //   const isPartipatedOrInCall = call.Participants.some(
  //     (participant) => participant.accountId === user.accountId && !participant.isInCall,
  //   );

  //   if (!call.isPublic && !isPartipatedOrInCall) {
  //     throw new ActionFailedException(ActionFailed.CALL_AUDIO_CAN_NOT_JOIN);
  //   }

  //   if (call.status === (RoomStatus.FINISHED || RoomStatus.CANCELLED)) {
  //     throw new ActionFailedException(ActionFailed.CALL_INVALID);
  //   }

  //   const updatedCall = await this.transactionHost.tx.audioRoom.update({
  //     where: { id: roomId },
  //     data: { activeParticipantCount: { increment: isPartipatedOrInCall ? 0 : COMMON_CONSTANT.DEFAULT_INCREMENT } },
  //     select: { id: true },
  //   });

  //   await this.transactionHost.tx.audioRoomParticipant.upsert({
  //     where: { roomId_accountId: { roomId: updatedCall.id, accountId: user.accountId } },
  //     create: {
  //       isInCall: true,
  //       role: ParticipantAudioRoomRole.USER,
  //       Account: connectRelation(user.accountId),
  //       AudioRoom: connectRelation(updatedCall.id),
  //     },
  //     update: { isInCall: true, joinedAt: nowEpoch() },
  //     select: { roomId: true },
  //   });

  //   return updatedCall;
  // }
}

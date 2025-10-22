import { Injectable } from '@nestjs/common';
import { AuthUserDTO } from 'src/domains/auth/dto/auth-user.dto';
import { FileService } from 'src/domains/file/file.service';
import { ImageService } from 'src/domains/image/image.service';
import { TransactionHost } from 'src/services/prisma/transactions/transaction-host';
import { AudioCallAdminListREQ } from '../admin/request/audio-call-admin-list.request';
import { AudioCallAdminListRESP } from '../admin/response/audio-call-admin-list.response';
import { participantMapper } from '../shared/helpers';
import { AudioRoomGetPayload, AudioRoomParticipantGetPayload } from '../shared/types';
import { AudioCallClientListREQ } from './request/audio-call-client-list.request';

@Injectable()
export class AudioCallClientService {
  constructor(
    private readonly transactionHost: TransactionHost,
    private readonly imageService: ImageService,
    private readonly fileService: FileService,
  ) {}

  async list(user: AuthUserDTO, query: AudioCallAdminListREQ) {
    const calls = await this.transactionHost.tx.audioRoom.findMany(AudioCallClientListREQ.toFindMany(query, user));
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
          false,
        );

        return AudioCallAdminListRESP.fromEntity(call, participantDtos);
      }),
    );
    const data = { callDTOs, count };

    return data;
  }
}

import { ParticipantAudioRoomRole } from '@prisma/client';
import { parseEpoch } from 'src/shared/parsers/common.parser';
import { AudioRoomActivityHistoryGetPayload, AudioRoomParticipantAccount } from '../shared/types';

export class AudioCallParticipantHistoryRESP {
  id: number;
  joinedAt: string;
  leftAt: string;
  AudioParticipant: { accountId: number; role: ParticipantAudioRoomRole } & AudioRoomParticipantAccount;

  static fromEntity(
    e: AudioRoomActivityHistoryGetPayload,
    account: AudioRoomParticipantAccount,
  ): AudioCallParticipantHistoryRESP {
    return {
      id: e.id,
      joinedAt: parseEpoch(e.joinedAt),
      leftAt: parseEpoch(e.leftAt),
      AudioParticipant: {
        accountId: e.AudioRoomParticipant.accountId,
        name: account.name,
        thumbnail: account.thumbnail,
        role: e.AudioRoomParticipant.role,
      },
    };
  }
}

import { AudioRoomParticipantDTO } from 'src/domains/audio-call/admin/dto/participant-dto';
import { AudioRoomGetPayload } from 'src/domains/audio-call/shared/types';
import { parseEpoch } from 'src/shared/parsers/common.parser';

export class MentorAdminInterviewRESP {
  creatorId: number;
  cid: string;
  startsAt: string;
  members: AudioRoomParticipantDTO[];

  static fromEntity(e: AudioRoomGetPayload, cid: string): MentorAdminInterviewRESP {
    return {
      creatorId: e.creatorId,
      cid: cid,
      startsAt: parseEpoch(e.startsAt),
      members: e.Participants.map((m) => ({
        accountId: m.accountId,
        role: m.role,
      })),
    };
  }
}

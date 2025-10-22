import { AudioRoomType, RoomStatus } from '@prisma/client';
import { parseEpoch } from 'src/shared/parsers/common.parser';
import { AudioRoomGetPayload } from '../../shared/types';
import { AudioRoomParticipantRESP } from './audio-call-admin-detail.response';

export class AudioCallAdminListRESP {
  id: number;
  title: string;
  status: RoomStatus;
  type: AudioRoomType;
  isPublic: boolean;
  duration: number;
  createdAt: string;
  startsAt: string;
  activeParticipantCount: number;
  cid: string;
  chatRoomId?: number;
  participants: AudioRoomParticipantRESP[];

  static fromEntity(entity: AudioRoomGetPayload, participants: AudioRoomParticipantRESP[]): AudioCallAdminListRESP {
    return {
      id: entity.id,
      title: entity.title,
      status: entity.status,
      type: entity.type,
      isPublic: entity.isPublic,
      duration: Number(entity.duration),
      createdAt: parseEpoch(entity.createdAt),
      startsAt: parseEpoch(entity.startsAt),
      cid: entity.cid,
      chatRoomId: entity.ChatRoom?.id,
      activeParticipantCount: entity.activeParticipantCount,
      participants,
    };
  }
}

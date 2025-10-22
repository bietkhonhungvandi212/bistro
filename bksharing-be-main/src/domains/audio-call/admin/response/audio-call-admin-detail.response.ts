import { AccountType, AudioRoomType, Gender, RoomStatus } from '@prisma/client';
import { FileRESP } from 'src/domains/file/response/file.response';
import { ImageRESP } from 'src/domains/image/response/image.response';
import { parseEpoch } from 'src/shared/parsers/common.parser';
import { parseDateToEpoch } from 'src/shared/parsers/datetime.parse';
import { AudioRoomGetPayload, AudioRoomParticipantGetPayload } from '../../shared/types';

export class AudioRoomParticipantRESP {
  id: number;
  name: string;
  gender: Gender;
  dob: string;
  accountType: AccountType;
  thumbnail?: ImageRESP;
  cv?: FileRESP;

  static fromEntity(entity: AudioRoomParticipantGetPayload, thumbnail?: ImageRESP, cv?: FileRESP): AudioRoomParticipantRESP {
    return {
      id: entity.Account.id,
      name: entity.Account.name,
      gender: entity.Account.gender,
      accountType: entity.Account.accountType,
      dob: String(parseDateToEpoch(entity.Account.dob)),
      thumbnail: thumbnail,
      cv: cv,
    };
  }
}

export class AudioCallAdminDetailRESP {
  id: number;
  title: string;
  status: RoomStatus;
  type: AudioRoomType;
  isPublic: boolean;
  duration: number;
  createdAt: string;
  startsAt: string;
  cid: string;
  participants: AudioRoomParticipantRESP[];

  static fromEntity(entity: AudioRoomGetPayload, participants: AudioRoomParticipantRESP[]): AudioCallAdminDetailRESP {
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
      participants: participants,
    };
  }
}

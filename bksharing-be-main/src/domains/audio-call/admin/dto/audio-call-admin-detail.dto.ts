import { AudioRoomType, Prisma, RoomStatus } from '@prisma/client';

export class AudioCallAdminDetailDTO {
  id: number;
  name: string;
  title: string;
  cid: string;
  status: RoomStatus;
  type: AudioRoomType;
  startsAt: string;
  roomUrl: string;
  duration: string;
  isPublic: boolean;
  creator: { id: number; name: string };
  custom: Record<string, any>;

  static toFindFirst(roomId: number): Prisma.AudioRoomFindFirstOrThrowArgs {
    return {
      where: { id: roomId },
      select: {
        id: true,
        title: true,
        cid: true,
        status: true,
        isPublic: true,
        type: true,
        startsAt: true,
        roomUrl: true,
        duration: true,
        Creator: { select: { id: true, name: true } },
      },
    };
  }

  static toFindManyParticipants(roomId: number): Prisma.AudioRoomParticipantFindManyArgs {
    return {
      where: { roomId },
      select: {
        Account: { select: { id: true, name: true, gender: true, dob: true, avatarId: true, accountType: true } },
      },
    };
  }
}

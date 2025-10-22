import { Prisma, RoomStatus } from '@prisma/client';
import { addUpdationTimestamps } from 'src/shared/helpers/add-timestamp.helper';

export class AudioCallEndDTO {
  static toEnd(roomId: number): Prisma.AudioRoomUpdateArgs {
    return {
      where: { id: roomId },
      data: {
        status: RoomStatus.FINISHED,
        Participants: {
          updateMany: {
            where: { roomId },
            data: addUpdationTimestamps({ isInCall: false }),
          },
        },
      },
      select: { id: true, status: true },
    };
  }
}

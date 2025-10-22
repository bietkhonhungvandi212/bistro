import { Prisma, RoomStatus } from '@prisma/client';
import { AuthUserDTO } from 'src/domains/auth/dto/auth-user.dto';

export class AudioCallStartDTO {
  static toStart(user: AuthUserDTO, roomId: number): Prisma.AudioRoomUpdateArgs {
    return {
      where: { id: roomId },
      data: {
        status: RoomStatus.ONGOING,
        // Participants: {
        //   update: {
        //     where: { roomId_accountId: { roomId, accountId: user.accountId } },
        //     data: addUpdationTimestamps({ joinedAt: nowEpoch(), isInCall: true }),
        //   },
        // },
      },
      select: { id: true, status: true },
    };
  }
}

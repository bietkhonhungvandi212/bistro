import { ParticipantAudioRoomRole, Prisma } from '@prisma/client';
import { AuthUserDTO } from 'src/domains/auth/dto/auth-user.dto';
import { addCreationTimestamps, addUpdationTimestamps } from 'src/shared/helpers/add-timestamp.helper';
import { connectRelation } from 'src/shared/helpers/prisma.helper';

export class AudioCallJoinDTO {
  static toUpsertParticipant(user: AuthUserDTO, roomId: number): Prisma.AudioRoomParticipantUpsertArgs {
    return {
      where: { roomId_accountId: { roomId: roomId, accountId: user.accountId } },
      create: addCreationTimestamps({
        isInCall: true,
        role: ParticipantAudioRoomRole.USER,
        Account: connectRelation(user.accountId),
        AudioRoom: connectRelation(roomId),
      }),

      update: addUpdationTimestamps({
        isInCall: true,
      }),
      select: { roomId: true },
    };
  }
}

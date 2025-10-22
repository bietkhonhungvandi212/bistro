import { Prisma } from '@prisma/client';
import { AuthUserDTO } from 'src/domains/auth/dto/auth-user.dto';
import { QueryPagingHelper } from 'src/shared/helpers/pagination.helper';
import { defaultSortDesc } from 'src/shared/helpers/query.helper';
import { AudioCallBaseListREQ } from '../../base/audio-call-list-base.request';

export class AudioCallAdminListREQ extends AudioCallBaseListREQ {
  static toFindMany(query: AudioCallAdminListREQ, user: AuthUserDTO): Prisma.AudioRoomFindManyArgs {
    const condition = AudioCallBaseListREQ.toQueryCondition(query, user);
    return {
      where: condition,
      orderBy: defaultSortDesc,
      ...QueryPagingHelper.queryPaging(query),
      select: {
        id: true,
        title: true,
        status: true,
        cid: true,
        type: true,
        startsAt: true,
        isPublic: true,
        duration: true,
        createdAt: true,
        activeParticipantCount: true,
        Participants: { select: { accountId: true, role: true, isInCall: true } },
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

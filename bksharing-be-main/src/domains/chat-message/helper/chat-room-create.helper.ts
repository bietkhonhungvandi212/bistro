import { ChatRoomType, Prisma } from '@prisma/client';
import { AuthUserDTO } from 'src/domains/auth/dto/auth-user.dto';
import { NUMBER_OF_MESSAGE_DEFAULT } from 'src/shared/constants/chat-message.constant';
import { COMMON_CONSTANT } from 'src/shared/constants/common.constant';
import { addCreationTimestamps } from 'src/shared/helpers/add-timestamp.helper';
import { connectRelation } from 'src/shared/helpers/prisma.helper';
import { orUndefinedWithCondition } from 'src/shared/parsers/io.parser';
import { ChatRoomCreateREQ } from '../request/chat-room-create.request';

export class ChatRoomCreateHelper {
  static toCreatChatRoom(body: ChatRoomCreateREQ): Prisma.ChatRoomCreateArgs {
    const numberOfParticipants = body.accountIds.length;
    const audioRoom = orUndefinedWithCondition(!!body.audioRoomId, {
      AudioRoom: connectRelation(body.audioRoomId),
    });

    return {
      data: {
        numberOfMessages: COMMON_CONSTANT.ZERO_VALUE,
        numberOfParticipants: numberOfParticipants,
        chatRoomType: body.chatRoomType,
        ...audioRoom,
        ChatParticipants: {
          createMany: {
            data: body.accountIds.map((accountId) => addCreationTimestamps({ participantId: accountId })),
          },
        },
      },
      select: { id: true },
    };
  }
  static toCreateInputWithReceiverId(user: AuthUserDTO, receiverId: number): Prisma.ChatRoomCreateArgs {
    const participants = [
      addCreationTimestamps({ participantId: user.accountId }),
      addCreationTimestamps({ participantId: receiverId }),
    ];

    return {
      data: {
        numberOfMessages: NUMBER_OF_MESSAGE_DEFAULT,
        numberOfParticipants: participants.length,
        chatRoomType: ChatRoomType.PRIVATE,
        ChatParticipants: { createMany: { data: participants } },
      },
      select: {
        id: true,
        ChatParticipants: { select: { participantId: true } },
      },
    };
  }

  static toFindFirst(user: AuthUserDTO, receiverId: number): Prisma.ChatRoomFindFirstArgs {
    return {
      where: {
        chatRoomType: ChatRoomType.PRIVATE,
        ChatParticipants: {
          every: { participantId: { in: [user.accountId, receiverId] } },
        },
      },
      select: { id: true },
    };
  }
}

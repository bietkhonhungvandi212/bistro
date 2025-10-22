import { WsException } from '@nestjs/websockets';
import { Prisma } from '@prisma/client';
import { AuthUserDTO } from 'src/domains/auth/dto/auth-user.dto';
import { nowEpoch } from 'src/shared/helpers/common.helper';
import { ChatRoomReadMessageREQ } from '../request/chat-room-read-message.request';

export class ChatRoomReadMessageHelper {
  static toFilterAccountReadMessage(user: AuthUserDTO, body: ChatRoomReadMessageREQ): Prisma.ChatMessageUpdateManyArgs['where'] {
    if (!body.chatRoomId) throw new WsException('Conversation ID is required');

    return {
      chatRoomId: body.chatRoomId,
      Sender: { id: { not: user.accountId } },
    };
  }

  static toUpdateInput(user: AuthUserDTO, body: ChatRoomReadMessageREQ): Prisma.ChatMessageUpdateManyArgs {
    const filterAccount = this.toFilterAccountReadMessage(user, body);
    return {
      where: {
        ...filterAccount,
        isRead: false,
      },
      data: { isRead: true, readAt: nowEpoch() },
    };
  }
}

import { Prisma } from '@prisma/client';
import { QueryPagingHelper } from 'src/shared/helpers/pagination.helper';
import { defaultSortAsc } from 'src/shared/helpers/query.helper';
import { ChatRoomDetailREQ } from '../request/chat-room-detail.request';

export class ChatRoomDetailHelper {
  static toFindUnique(roomId: number): Prisma.ChatRoomFindUniqueArgs {
    return {
      where: { id: roomId },
      select: {
        id: true,
        chatRoomType: true,
        numberOfMessages: true,
        numberOfParticipants: true,
        audioRoomId: true,
        ChatParticipants: { select: { participantId: true } },
      },
    };
  }

  static toFindManyMessages(roomId: number, body: ChatRoomDetailREQ): Prisma.ChatMessageFindManyArgs {
    return {
      where: { chatRoomId: roomId },
      ...QueryPagingHelper.queryPaging(body),
      orderBy: defaultSortAsc,
      select: {
        id: true,
        Sender: { select: { id: true, accountType: true } },
        message: true,
        isRead: true,
        chatRoomId: true,
        updatedAt: true,
        createdAt: true,
        readAt: true,
      },
    };
  }
}

import { AccountType, ChatRoomType, Prisma } from '@prisma/client';
import { AuthUserDTO } from 'src/domains/auth/dto/auth-user.dto';
import { SortOrder } from 'src/shared/enums/query.enum';
import { ActionFailed, ActionFailedException } from 'src/shared/exceptions/action-failed.exception';
import { QueryPagingHelper } from 'src/shared/helpers/pagination.helper';
import { leanObject, parsePrismaSearch } from 'src/shared/parsers/common.parser';
import { orUndefinedWithCondition } from 'src/shared/parsers/io.parser';
import { ChatRoomListREQ } from '../request/chat-room-list.request';

export class ChatRoomListHelper {
  static toFilterByAccountType(user: AuthUserDTO): Prisma.ChatRoomWhereInput {
    switch (user.accountType) {
      case AccountType.MENTOR:
      case AccountType.STUDENT:
        return {
          ChatParticipants: {
            some: { participantId: user.accountId },
          },
        };
      default:
        throw new ActionFailedException(ActionFailed.AUTH_ACCOUNT_FORBIDDEN);
    }
  }

  static toQueryCondition(user: AuthUserDTO, query: ChatRoomListREQ): Prisma.ChatRoomWhereInput {
    const receiverName = orUndefinedWithCondition(!!query.receiverName, {
      Creator: { Buyer: parsePrismaSearch('name', query.receiverName) },
    });

    const chatRoomType = orUndefinedWithCondition(!!query.chatRoomType, { chatRoomType: query.chatRoomType });
    const toFilterByAccountType = this.toFilterByAccountType(user);

    return leanObject({ ...toFilterByAccountType, ...receiverName, ...chatRoomType });
  }

  static findMany(user: AuthUserDTO): Prisma.ChatRoomFindManyArgs {
    return {
      where: {
        ...this.toFilterByAccountType(user),
        chatRoomType: ChatRoomType.PRIVATE,
      },
      select: { id: true },
    };
  }

  static toFindManyPrivateRoom(user: AuthUserDTO, query: ChatRoomListREQ): Prisma.ChatRoomFindManyArgs {
    const condition = this.toQueryCondition(user, query);

    return {
      where: { ...condition, chatRoomType: ChatRoomType.PRIVATE },
      orderBy: { lastMessageId: SortOrder.DESC },
      ...QueryPagingHelper.queryPaging(query),
      select: {
        id: true,
        lastMessageId: true,
        numberOfMessages: true,
        numberOfParticipants: true,
        chatRoomType: true,
        ChatParticipants: { select: { participantId: true } },
      },
    };
  }
}

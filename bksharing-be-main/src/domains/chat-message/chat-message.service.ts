import { Injectable, Logger } from '@nestjs/common';
import { RoomStatus } from '@prisma/client';
import { TransactionHost } from 'src/services/prisma/transactions/transaction-host';
import { Transactional } from 'src/services/prisma/transactions/transactional.decorator';
import { NUMBER_MESSAGE_INCREMENT_DEFAULT } from 'src/shared/constants/chat-message.constant';
import { TRANSACTION_TIMEOUT } from 'src/shared/constants/prisma.constant';
import { ActionFailed, ActionFailedException } from 'src/shared/exceptions/action-failed.exception';
import { AccountService } from '../accounts/account.service';
import { AuthUserDTO } from '../auth/dto/auth-user.dto';
import { ChatRoomCreateHelper } from './helper/chat-room-create.helper';
import { ChatRoomDetailHelper } from './helper/chat-room-detail.helper';
import { ChatRoomListHelper } from './helper/chat-room-list-helper';
import { ChatRoomReadMessageHelper } from './helper/chat-room-read-message.helper';
import { ChatGroupMessageCreateREQ, ChatPrivateMessageCreateREQ } from './request/chat-message-create.request';
import { ChatRoomCreateREQ } from './request/chat-room-create.request';
import { ChatRoomDetailREQ } from './request/chat-room-detail.request';
import { ChatRoomListREQ } from './request/chat-room-list.request';
import { ChatRoomReadMessageREQ } from './request/chat-room-read-message.request';
import { ChatMessageDetailRESP, ChatRoomDetailRESP } from './response/chat-room-detail.response';
import { ChatRoomListRESP } from './response/chat-room-list.response';
import { ChatMessageCreateRESP } from './response/message-chat-create.response';
import { ChatMessageGetPayload, ChatRoomGetPayload } from './shared/types';

@Injectable()
export class ChatMessageService {
  private logger = new Logger(ChatMessageService.name);
  constructor(
    private readonly transactionHost: TransactionHost,
    private readonly accountService: AccountService,
  ) {}

  async findAll(user: AuthUserDTO, query: ChatRoomListREQ) {
    const conversations = await this.transactionHost.tx.chatRoom.findMany(ChatRoomListHelper.toFindManyPrivateRoom(user, query));

    const count = await this.transactionHost.tx.chatRoom.count({
      where: ChatRoomListHelper.toQueryCondition(user, query),
    });

    const chatRoomDtos = await Promise.all(
      conversations.map(async (chatRoom: ChatRoomGetPayload) => {
        const lastMessage =
          chatRoom.lastMessageId &&
          ((await this.transactionHost.tx.chatMessage.findFirst({
            where: { id: chatRoom.lastMessageId },
            select: { message: true, createdAt: true, senderId: true },
          })) as ChatMessageGetPayload);

        const numOfUnreadMessage = await this.transactionHost.tx.chatMessage.count({
          where: { chatRoomId: chatRoom.id, isRead: false },
        });

        const receiverParticipant = chatRoom.ChatParticipants.find((participant) => participant.participantId !== user.accountId);
        const receiver = await this.accountService.getMe(receiverParticipant.participantId);
        const result = ChatRoomListRESP.fromEntity(chatRoom, lastMessage, numOfUnreadMessage, {
          id: receiver.account.id,
          name: receiver.account.name,
          thumbnail: receiver.thumbnail,
        });

        return result;
      }),
    );

    return { chatRoomDtos, count: count };
  }

  async joinPrivateConversation(user: AuthUserDTO, receiverId: number) {
    const chatRoom = (await this.transactionHost.tx.chatRoom.findFirst(
      ChatRoomCreateHelper.toFindFirst(user, receiverId),
    )) as ChatRoomGetPayload;

    if (chatRoom) {
      return { chatRoom: chatRoom, isNewConversation: false };
    }

    const newConversation = await this.transactionHost.tx.chatRoom.create(
      ChatRoomCreateHelper.toCreateInputWithReceiverId(user, receiverId),
    );

    return { chatRoom: newConversation, isNewConversation: true };
  }

  async joinGroupConversation(user: AuthUserDTO, chatRoomId: number) {
    let chatRoom: ChatRoomGetPayload;
    try {
      chatRoom = (await this.transactionHost.tx.chatRoom.findUniqueOrThrow(
        ChatRoomDetailHelper.toFindUnique(chatRoomId),
      )) as ChatRoomGetPayload;
    } catch (error) {
      this.logger.error('🚀 ~ ChatMessageService ~ joinGroupConversation ~ error:', error);
      throw new ActionFailedException(ActionFailed.CHAT_ROOM_NOT_EXIST, 'This conversation is not available');
    }

    const isParticipated = await this.isParticipantBelongToConversation(user.accountId, chatRoom.id);
    if (!isParticipated) {
      throw new ActionFailedException(ActionFailed.CHAT_ROOM_NOT_INCLUDE_USER, 'You are not allowed to view this conversation');
    }

    if (chatRoom.audioRoomId) {
      const callAudio = await this.transactionHost.tx.audioRoom.findFirst({
        where: { id: chatRoom.audioRoomId },
        select: { id: true, status: true },
      });

      if (callAudio.status !== RoomStatus.ONGOING)
        throw new ActionFailedException(ActionFailed.CALL_AUDIO_HAVE_NOT_STARTED, 'This conversation is not available');
    }

    return chatRoom.id;
  }

  async createPrivateMessageChat(user: AuthUserDTO, chatRoomId: number, body: ChatPrivateMessageCreateREQ) {
    const message = await this.transactionHost.tx.chatMessage.create(
      ChatPrivateMessageCreateREQ.toCreateInput(user, chatRoomId, body),
    );

    await this.transactionHost.tx.chatRoom.update({
      where: { id: chatRoomId },
      data: { numberOfMessages: { increment: NUMBER_MESSAGE_INCREMENT_DEFAULT }, lastMessageId: message.id },
      select: { id: true },
    });

    return ChatMessageCreateRESP.fromEntity(message as ChatMessageGetPayload);
  }

  async createGroupMessageChat(user: AuthUserDTO, body: ChatGroupMessageCreateREQ) {
    const chatRoom = await this.transactionHost.tx.chatRoom.findUniqueOrThrow({
      where: { id: body.chatRoomId },
      select: { id: true, ChatParticipants: { select: { participantId: true } } },
    });

    const isParticipated = chatRoom.ChatParticipants.some((participant) => participant.participantId === user.accountId);
    if (!isParticipated) {
      throw new ActionFailedException(ActionFailed.CHAT_ROOM_NOT_INCLUDE_USER, 'You are not allowed to view this conversation');
    }

    const message = await this.transactionHost.tx.chatMessage.create(ChatGroupMessageCreateREQ.toCreateInput(user, body));

    await this.transactionHost.tx.chatRoom.update({
      where: { id: body.chatRoomId },
      data: { numberOfMessages: { increment: NUMBER_MESSAGE_INCREMENT_DEFAULT }, lastMessageId: message.id },
      select: { id: true },
    });

    return ChatMessageCreateRESP.fromEntity(message as ChatMessageGetPayload);
  }

  async createChatRoom(body: ChatRoomCreateREQ) {
    const chatRoom = await this.transactionHost.tx.chatRoom.create(ChatRoomCreateHelper.toCreatChatRoom(body));

    return chatRoom.id;
  }

  async getAllMessagesByRoomId(user: AuthUserDTO, roomId: number, body: ChatRoomDetailREQ) {
    const isPaticipated = await this.isParticipantBelongToConversation(user.accountId, roomId);
    if (!isPaticipated) {
      throw new ActionFailedException(ActionFailed.CHAT_ROOM_NOT_INCLUDE_USER, 'You are not allowed to view this conversation');
    }

    const chatRoom = (await this.transactionHost.tx.chatRoom.findUniqueOrThrow(
      ChatRoomDetailHelper.toFindUnique(roomId),
    )) as ChatRoomGetPayload;

    const messages = await this.transactionHost.tx.chatMessage.findMany(
      ChatRoomDetailHelper.toFindManyMessages(chatRoom.id, body),
    );

    const receiverParticipant = chatRoom.ChatParticipants.find((participant) => participant.participantId !== user.accountId);
    const receiver = await this.accountService.getMe(receiverParticipant.participantId);

    const messageDTOs = messages.map((e: ChatMessageGetPayload) => {
      return ChatMessageDetailRESP.fromEntity(e, user.accountId !== e.Sender.id);
    });

    return ChatRoomDetailRESP.fromEntity(chatRoom, messageDTOs, {
      id: receiver.account.id,
      name: receiver.account.name,
      thumbnail: receiver.thumbnail,
    });
  }

  @Transactional(TRANSACTION_TIMEOUT)
  async readMessage(user: AuthUserDTO, body: ChatRoomReadMessageREQ) {
    const isParticipated = await this.isParticipantBelongToConversation(user.accountId, body.chatRoomId);
    if (!isParticipated) {
      throw new ActionFailedException(ActionFailed.CHAT_ROOM_NOT_INCLUDE_USER, 'You are not allowed to view this conversation');
    }

    const messages = await this.transactionHost.tx.chatMessage.updateMany(ChatRoomReadMessageHelper.toUpdateInput(user, body));
    this.logger.log('🚀 ~ ChatMessageService ~ readMessage ~ messages:', messages);
  }

  async isParticipantBelongToConversation(accountId: number, roomId: number) {
    const conversation = await this.transactionHost.tx.chatParticipant.findFirst({
      where: { chatRoomId: roomId, participantId: accountId },
      select: { chatRoomId: true },
    });

    return Boolean(conversation);
  }
}

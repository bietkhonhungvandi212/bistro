import { ChatMessageType, Prisma } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { AuthUserDTO } from 'src/domains/auth/dto/auth-user.dto';
import { connectRelation } from 'src/shared/helpers/prisma.helper';
import { IdValidator } from 'src/shared/request-validator/id.validator';

export class ChatPrivateMessageCreateREQ {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsEnum(ChatMessageType)
  type: ChatMessageType;

  @IdValidator()
  receiverId: number; // Only for private chat room

  static toCreateInput(user: AuthUserDTO, chatRoomId: number, body: ChatPrivateMessageCreateREQ): Prisma.ChatMessageCreateArgs {
    return {
      data: {
        message: body.message,
        Sender: connectRelation(user.accountId),
        type: body.type,
        ChatRoom: connectRelation(chatRoomId),
      },
      select: {
        id: true,
        message: true,
        isRead: true,
        createdAt: true,
        chatRoomId: true,
        Sender: { select: { id: true, name: true } },
      },
    };
  }
}

export class ChatGroupMessageCreateREQ {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsEnum(ChatMessageType)
  type: ChatMessageType;

  @IdValidator()
  chatRoomId: number; // Only for private chat room

  static toCreateInput(user: AuthUserDTO, body: ChatGroupMessageCreateREQ): Prisma.ChatMessageCreateArgs {
    return {
      data: {
        message: body.message,
        Sender: connectRelation(user.accountId),
        type: body.type,
        ChatRoom: connectRelation(body.chatRoomId),
      },
      select: {
        id: true,
        message: true,
        isRead: true,
        createdAt: true,
        chatRoomId: true,
        Sender: { select: { id: true, name: true } },
      },
    };
  }
}

import { Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';
import { AuthSocket, SocketAuthMiddleware } from 'src/middlewares/socket-auth.middleware';
import { TransactionHost } from 'src/services/prisma/transactions/transaction-host';
import { SOCKET_CHAT_MESSAGE_EVENT } from 'src/shared/constants/chat-message.constant';
import { BaseResponse } from 'src/shared/generics/base.response';
import { nowEpoch } from 'src/shared/helpers/common.helper';
import { parseRoomChatId } from 'src/shared/parsers/io.parser';
import { AuthJwtPayloadDTO } from '../auth/dto/auth-jwt-payload.dto';
import { AuthUserDTO } from '../auth/dto/auth-user.dto';
import { ChatMessageService } from './chat-message.service';
import { ChatRoomListHelper } from './helper/chat-room-list-helper';
import { ChatGroupMessageCreateREQ, ChatPrivateMessageCreateREQ } from './request/chat-message-create.request';
import { ChatRoomPrivateCreateREQ } from './request/chat-room-private-create.request';
import { ChatRoomReadMessageREQ } from './request/chat-room-read-message.request';

@WebSocketGateway({
  namespace: 'message-chat',
  cors: {
    credentials: true,
    origin: ['http://localhost:3000', 'https://bksharing.social', 'https://www.bksharing.social'],
  },
})
export class ChatMessageGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(ChatMessageGateway.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly transactionHost: TransactionHost,
    private readonly chatMessageService: ChatMessageService,
  ) {}

  @WebSocketServer()
  server: Namespace;

  connectedUsers: Map<string, AuthUserDTO> = new Map();

  afterInit(client: Socket) {
    const middleware = SocketAuthMiddleware(this.jwtService, this.logger);

    client.use(middleware as any); // because types are broken
    this.logger.log('Message Chat Gateway initialized');
  }

  handleDisconnect(client: Socket) {
    client.disconnect();
    this.connectedUsers.delete(client.id);
    this.logger.log(`Client with id ${client.id} disconnected at ${nowEpoch()} `);
  }

  async handleConnection(client: AuthSocket) {
    const user = await this.getAccountFromJWTPayload(client.payload);

    if (!user) {
      this.logger.error(
        `🚀 ~ MessageChatGateway ~ handleConnection ~  Client with id ${client.id} cannot connect due to error with identification`,
      );
      client.disconnect();
      return;
    }

    this.connectedUsers.set(client.id, user);

    this.logger.log(
      `🚀 ~ MessageChatGateway ~ handleConnection ~  Client with id ${client.id} connected at ${new Date().toDateString()}`,
    );
    await this.onConnectRoom(user, client);
  }

  // ==================== MESSAGE CHAT PRIVATE EVENT ====================
  @SubscribeMessage(SOCKET_CHAT_MESSAGE_EVENT.SEND_PRIVATE_MESSAGE)
  async onSendMessage(@MessageBody() body: ChatPrivateMessageCreateREQ, @ConnectedSocket() client: AuthSocket) {
    const user = await this.getAccountFromJWTPayload(client.payload);

    // const isMemberConversation = user.accountType === AccountType.COMPANY_ADMIN && !isUndefined(body.chatRoomId);

    const chatRoomId = await this.onJoinRoom(client, { receiverId: body.receiverId });

    const message = await this.chatMessageService.createPrivateMessageChat(user, chatRoomId, body);

    this.server.to(parseRoomChatId(message.chatRoomId)).emit(SOCKET_CHAT_MESSAGE_EVENT.NEW_MESSAGE, message);
    return BaseResponse.of(message);
  }

  @SubscribeMessage(SOCKET_CHAT_MESSAGE_EVENT.JOIN_PRIVATE_ROOM)
  async onJoinRoom(@ConnectedSocket() client: AuthSocket, @MessageBody() body: ChatRoomPrivateCreateREQ) {
    const user = await this.getAccountFromJWTPayload(client.payload);

    const { chatRoom, isNewConversation } = await this.chatMessageService.joinPrivateConversation(user, body.receiverId);

    await client.join(parseRoomChatId(chatRoom.id));

    //loop hashmap key connectedUsers
    if (isNewConversation) await this.connectReceiverToConversation(chatRoom.id, body.receiverId);

    return chatRoom.id;
  }

  // ==================== MESSAGE CHAT GROUP EVENT ====================
  @SubscribeMessage(SOCKET_CHAT_MESSAGE_EVENT.SEND_GROUP_MESSAGE)
  async onSendGroupMessage(@MessageBody() body: ChatGroupMessageCreateREQ, @ConnectedSocket() client: AuthSocket) {
    const user = await this.getAccountFromJWTPayload(client.payload);

    const chatRoomId = await this.chatMessageService.joinGroupConversation(user, body.chatRoomId);
    await client.join(parseRoomChatId(chatRoomId));

    const message = await this.chatMessageService.createGroupMessageChat(user, body);

    this.server.to(parseRoomChatId(message.chatRoomId)).emit(SOCKET_CHAT_MESSAGE_EVENT.NEW_MESSAGE, message);
    return BaseResponse.of(message);
  }

  @SubscribeMessage(SOCKET_CHAT_MESSAGE_EVENT.JOIN_GROUP_ROOM)
  async onJoinGroupRoom(@ConnectedSocket() client: AuthSocket, @MessageBody() body: { chatRoomId: number }) {
    const user = await this.getAccountFromJWTPayload(client.payload);
    const chatRoomId = await this.chatMessageService.joinGroupConversation(user, body.chatRoomId);

    await client.join(parseRoomChatId(chatRoomId));

    return BaseResponse.of(chatRoomId);
  }

  @SubscribeMessage(SOCKET_CHAT_MESSAGE_EVENT.READ_MESSAGE)
  async onReadMessage(@MessageBody() body: ChatRoomReadMessageREQ, @ConnectedSocket() client: AuthSocket) {
    const user = await this.getAccountFromJWTPayload(client.payload);

    await this.chatMessageService.readMessage(user, body);
    this.logger.log(
      `🚀 ~ ChatMessageGateway ~ onReadMessage ~ chatMessageService: User ${user.accountId} read message in room ${body.chatRoomId}`,
    );
  }

  private async onConnectRoom(user: AuthUserDTO, @ConnectedSocket() client: AuthSocket) {
    const rooms = await this.connectConversation(user);
    if (rooms && rooms.length !== 0) {
      for (const room of rooms) {
        await client.join(parseRoomChatId(room.id));
      }
    }

    return rooms;
  }

  private async connectConversation(user: AuthUserDTO) {
    const conservations = await this.transactionHost.tx.chatRoom.findMany(ChatRoomListHelper.findMany(user));

    return conservations;
  }

  private async connectReceiverToConversation(chatRoomId: number, receiverId: number) {
    for (const clientId of this.connectedUsers.keys()) {
      const account = this.connectedUsers.get(clientId);

      if (account.accountId === receiverId) {
        await this.server.sockets.get(clientId).join(parseRoomChatId(chatRoomId));
      }
    }
  }

  private async getAccountFromJWTPayload(payload: AuthJwtPayloadDTO): Promise<AuthUserDTO> {
    if (!payload) throw new WsException(UnauthorizedException);
    const account = await this.transactionHost.tx.account.findUnique({
      where: { id: Number(payload.sub) },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        accountType: true,
      },
    });

    if (!account) throw new UnauthorizedException('Account not found');
    return AuthUserDTO.fromEntity(account as any);
  }
}

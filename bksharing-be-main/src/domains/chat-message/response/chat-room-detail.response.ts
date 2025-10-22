import { parseEpoch } from 'src/shared/parsers/common.parser';
import { ChatMessageGetPayload, ChatRoomGetPayload, ChatRoomReceiverRESP } from '../shared/types';

export class ChatMessageDetailRESP {
  id: number;
  content: string;
  senderId: number;
  isReceiver: boolean;
  isRead: boolean;
  createdAt: Date;
  readAt: Date;
  chatRoomId: number;

  static fromEntity(e: ChatMessageGetPayload, isReceiver: boolean): ChatMessageDetailRESP {
    return {
      id: e.id,
      content: e.message,
      senderId: e.Sender.id,
      isReceiver: isReceiver,
      createdAt: parseEpoch(e.createdAt),
      readAt: parseEpoch(e.readAt),
      chatRoomId: e.chatRoomId,
      isRead: e.isRead,
    };
  }
}

export class ChatRoomDetailRESP {
  id: number;
  receiver: ChatRoomReceiverRESP;
  noOfMessages: number;
  messages: ChatMessageDetailRESP[];

  static fromEntity(
    chatRoom: ChatRoomGetPayload,
    messages: ChatMessageDetailRESP[],
    receiver: ChatRoomReceiverRESP,
  ): ChatRoomDetailRESP {
    return {
      id: chatRoom.id,
      receiver: receiver,
      noOfMessages: chatRoom.numberOfMessages,
      messages: messages,
    };
  }
}

import { parseEpoch } from 'src/shared/parsers/common.parser';
import { ChatMessageGetPayload, ChatRoomGetPayload, ChatRoomReceiverRESP } from '../shared/types';

export class ChatRoomListRESP {
  id: number;
  receiver: ChatRoomReceiverRESP;
  isSeen: boolean;
  lastMessage: {
    isReceiver: boolean;
    content: string;
  };
  lastMessageAt: string;
  numOfUnreadMessage: number;

  static fromEntity(
    entity: ChatRoomGetPayload,
    lastMessage: ChatMessageGetPayload,
    numOfUnreadMessage: number,
    receiver: ChatRoomReceiverRESP,
  ): ChatRoomListRESP {
    return {
      id: entity.id,
      numOfUnreadMessage: numOfUnreadMessage,
      lastMessage: {
        isReceiver: lastMessage && lastMessage.senderId === receiver.id,
        content: lastMessage && lastMessage.message,
      },
      lastMessageAt: lastMessage && parseEpoch(lastMessage.createdAt),
      isSeen: numOfUnreadMessage === 0,
      receiver: receiver,
    };
  }
}

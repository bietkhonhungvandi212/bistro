import { parseEpoch } from 'src/shared/parsers/common.parser';
import { ChatMessageGetPayload } from '../shared/types';

export class ChatMessageCreateRESP {
  id: number;
  content: string;
  senderId: number;
  isRead: boolean;
  createdAt: Date;
  name: string;
  chatRoomId: number;

  static fromEntity(e: ChatMessageGetPayload): ChatMessageCreateRESP {
    return {
      id: e.id,
      content: e.message,
      senderId: e.Sender?.id,
      name: e.Sender?.name,
      createdAt: parseEpoch(e.createdAt),
      chatRoomId: e.chatRoomId,
      isRead: e.isRead,
    };
  }
}

import { ChatRoomType } from '@prisma/client';

export class ChatRoomCreateREQ {
  chatRoomType: ChatRoomType;
  accountIds: number[];
  audioRoomId?: number;
}

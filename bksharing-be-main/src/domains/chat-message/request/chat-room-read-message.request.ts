import { IsNumber } from 'class-validator';

export class ChatRoomReadMessageREQ {
  @IsNumber()
  chatRoomId: number;
}

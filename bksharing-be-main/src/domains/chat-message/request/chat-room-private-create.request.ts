import { IdValidator } from 'src/shared/request-validator/id.validator';

export class ChatRoomPrivateCreateREQ {
  @IdValidator()
  receiverId: number;
}

import { Prisma } from '@prisma/client';
import { AccountRESP } from 'src/domains/accounts/response/account.response';

export type ChatMessageGetPayload = Prisma.ChatMessageGetPayload<{ include: { Sender: true; ChatRoom: true } }>;

export type ChatRoomGetPayload = Prisma.ChatRoomGetPayload<{
  include: { ChatMessages: true; ChatParticipants: true; AudioRoom: true };
}>;

export type ChatRoomReceiverRESP = Pick<AccountRESP, 'id' | 'name' | 'thumbnail'>;

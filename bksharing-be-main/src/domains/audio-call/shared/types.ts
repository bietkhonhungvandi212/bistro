import { Prisma } from '@prisma/client';
import { AccountRESP } from 'src/domains/accounts/response/account.response';

export type AudioRoomParticipantAccount = Pick<AccountRESP, 'name' | 'thumbnail'>;

export type AudioRoomGetPayload = Prisma.AudioRoomGetPayload<{
  include: {
    Participants: true;
    Creator: true;
    Subscriptions: true;
    ChatRoom: true;
  };
}>;

export type AudioRoomParticipantGetPayload = Prisma.AudioRoomParticipantGetPayload<{
  include: { Account: true; AudioRoom: true; AudioRoomActivityHistories: true };
}>;

export type AudioRoomActivityHistoryGetPayload = Prisma.AudioRoomActivityHistoryGetPayload<{
  include: { AudioRoomParticipant: { include: { Account: true } } };
}>;

export type AudioRoomSessionParticipantLeave = {
  call_cid: string;
  participant: { user: { id: number } };
};

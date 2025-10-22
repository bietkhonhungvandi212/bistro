import { AccountStatus, AccountType, Prisma } from '@prisma/client';
import { ImageRESP } from 'src/domains/image/response/image.response';

export class AuthRegisterRESP {
  id: number;
  accountType: AccountType;
  name: string;
  status: AccountStatus;
  avatar: ImageRESP;
  token?: string;

  static fromAccount(account: Prisma.AccountGetPayload<unknown>, avatar: ImageRESP, token?: string): AuthRegisterRESP {
    return {
      id: account.id,
      name: account.name,
      avatar: avatar,
      status: account.status,
      accountType: account.accountType,
      token,
    };
  }
}

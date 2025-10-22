import { Prisma } from '@prisma/client';
import { ImageRESP } from 'src/domains/image/response/image.response';

export class AuthLoginRESP {
  id: number;
  accessToken: string;
  accountType: string;
  name: string;
  avatar: ImageRESP;

  static fromAccount(account: Prisma.AccountGetPayload<unknown>, accessToken: string, avatar: ImageRESP): AuthLoginRESP {
    return {
      id: account.id,
      name: account.name,
      accessToken,
      accountType: account.accountType,
      avatar: avatar,
    };
  }
}

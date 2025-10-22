import { Account, Prisma } from '@prisma/client';

export class AuthUserDTO {
  accountId: Account['id'];
  email: Account['email'];
  phoneNumber: Account['phoneNumber'];
  accountType: Account['accountType'];

  static fromEntity(a: Prisma.AccountGetPayload<unknown>): AuthUserDTO {
    return {
      accountId: a.id,
      email: a.email,
      phoneNumber: a.phoneNumber,
      accountType: a.accountType,
    };
  }
}

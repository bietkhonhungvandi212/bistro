import { Prisma } from '@prisma/client';

import { AuthLoginREQ } from '../request/auth-login.request';

export class AuthLoginDTO {
  email: string;
  password: string;
  ipAddress?: string;

  static fromRequest(body: AuthLoginREQ, ipAddress: string): AuthLoginDTO {
    return { email: body.email, password: body.password, ipAddress };
  }

  static toFindAccountUnique(body: AuthLoginDTO): Prisma.AccountFindFirstOrThrowArgs {
    return {
      where: { email: body.email },
      select: {
        name: true,
        id: true,
        email: true,
        password: true,
        accountType: true,
        avatarId: true,
      },
    };
  }
}

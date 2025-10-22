import { Prisma } from '@prisma/client';
import { IsString } from 'class-validator';
import { connectRelation } from 'src/shared/helpers/prisma.helper';

export class FcmRegisterTokenREQ {
  @IsString()
  token: string;

  static toCreateToken(accountId: number, body: FcmRegisterTokenREQ): Prisma.DeviceTokenCreateArgs {
    return {
      data: { token: body.token, Account: connectRelation(accountId) },
      select: { id: true },
    };
  }
}

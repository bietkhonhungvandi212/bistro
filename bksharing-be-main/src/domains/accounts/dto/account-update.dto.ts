import { Gender, Prisma } from '@prisma/client';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { AuthUserDTO } from 'src/domains/auth/dto/auth-user.dto';
import { connectRelation } from 'src/shared/helpers/prisma.helper';
import { parsePrismaDate } from 'src/shared/parsers/datetime.parse';
import {
  AddressBaseValidator,
  AddressDetailValidator,
  EmailValidator,
  PhoneNumberValidator,
} from 'src/shared/request-validator/account.validator';
import { IdValidator } from 'src/shared/request-validator/id.validator';
import { OnlyDate } from 'src/shared/request-validator/only-date.request-validator';

export class AccountUpdateDTO {
  @IsString()
  @IsOptional()
  name?: string;

  @EmailValidator()
  @IsOptional()
  email?: string;

  @PhoneNumberValidator()
  @IsOptional()
  phoneNumber?: string;

  @IsOptional()
  @AddressBaseValidator()
  addressBase?: string;

  @AddressDetailValidator()
  @IsOptional()
  addressDetail?: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  bio?: string;

  @IdValidator()
  @IsOptional()
  avatarId?: number;

  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @OnlyDate()
  @IsOptional()
  dob?: string;

  static toUpdate(user: AuthUserDTO, body: AccountUpdateDTO): Prisma.AccountUpdateArgs {
    return {
      where: { id: user.accountId },
      data: {
        name: body.name,
        email: body.email,
        gender: body.gender,
        bio: body.bio,
        phoneNumber: body.phoneNumber,
        addressBase: body.addressBase,
        addressDetail: body.addressDetail,
        dob: body.dob && parsePrismaDate(body.dob),
        Avatar: body.avatarId && connectRelation(body.avatarId),
      },
      select: { id: true },
    };
  }
}

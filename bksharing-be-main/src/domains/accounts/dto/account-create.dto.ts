import { AccountType, Gender } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import {
  AddressBaseValidator,
  AddressDetailValidator,
  EmailValidator,
  NameValidator,
  PasswordValidator,
  PhoneNumberValidator,
} from 'src/shared/request-validator/account.validator';
import { OnlyDate } from 'src/shared/request-validator/only-date.request-validator';

export class AccountCreateDTO {
  @EmailValidator()
  email: string;

  @PasswordValidator()
  password: string;

  @PhoneNumberValidator()
  phoneNumber: string;

  @IsEnum(AccountType)
  accountType: AccountType;

  @NameValidator()
  name: string;

  @IsEnum(Gender)
  gender: Gender;

  @OnlyDate()
  dob: Date;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsOptional()
  @AddressBaseValidator()
  addressBase?: string;

  @IsOptional()
  @AddressDetailValidator()
  addressDetail?: string;
}

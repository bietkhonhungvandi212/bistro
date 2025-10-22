import { AccountType, Gender } from '@prisma/client';
import { IsOptional } from 'class-validator';
import { random } from 'lodash';
import { AccountCreateDTO } from 'src/domains/accounts/dto/account-create.dto';
import { parsePrismaDate } from 'src/shared/parsers/datetime.parse';
import { EmailValidator, NameValidator, PasswordValidator } from 'src/shared/request-validator/account.validator';
import { OnlyDate } from 'src/shared/request-validator/only-date.request-validator';

export class AuthTestAccountREQ {
  @EmailValidator()
  email: string;

  @NameValidator()
  name: string;

  @OnlyDate()
  dob: string;

  @PasswordValidator()
  password: string;

  @IsOptional()
  accountType?: AccountType = AccountType.STUDENT;

  static toAccountDto(body: AuthTestAccountREQ): AccountCreateDTO {
    const parseDob = parsePrismaDate(body.dob);
    return {
      name: body.name,
      dob: new Date(parseDob),
      gender: Gender.MALE,
      email: body.email,
      password: body.password,
      phoneNumber: `628${random(1000000000)}`,
      accountType: body.accountType,
    };
  }
}

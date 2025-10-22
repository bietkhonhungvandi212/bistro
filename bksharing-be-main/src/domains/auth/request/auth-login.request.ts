import { EmailValidator, PasswordValidator } from 'src/shared/request-validator/account.validator';

export class AuthLoginREQ {
  @EmailValidator()
  email: string;

  @PasswordValidator()
  password: string;
}

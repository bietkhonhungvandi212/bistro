import { EmailValidator } from 'src/shared/request-validator/account.validator';

export class AuthFindPasswordResetREQ {
  @EmailValidator()
  email: string;
}

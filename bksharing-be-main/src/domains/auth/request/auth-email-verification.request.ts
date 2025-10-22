import { EmailValidator } from 'src/shared/request-validator/account.validator';

export class AuthEmailVerificationREQ {
  @EmailValidator()
  email: string;
}

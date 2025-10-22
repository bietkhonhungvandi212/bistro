import { IsString } from 'class-validator';
import { PasswordValidator } from 'src/shared/request-validator/account.validator';

export class AuthFindPasswordResetREQ {
  @PasswordValidator()
  password: string;

  @IsString()
  token: string;
}

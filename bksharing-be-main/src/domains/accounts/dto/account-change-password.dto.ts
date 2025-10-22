import { PasswordValidator } from 'src/shared/request-validator/account.validator';

export class AccountChangePasswordDTO {
  @PasswordValidator()
  currentPassword: string;

  @PasswordValidator()
  newPassword: string;
}

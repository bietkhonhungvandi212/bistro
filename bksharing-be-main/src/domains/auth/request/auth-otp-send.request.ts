import { PhoneNumberValidator } from 'src/shared/request-validator/account.validator';

export class AuthOtpSendREQ {
  @PhoneNumberValidator()
  phoneNumber: string;
}

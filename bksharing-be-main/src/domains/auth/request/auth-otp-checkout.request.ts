import { OtpValidator, PhoneNumberValidator } from 'src/shared/request-validator/account.validator';

export class AuthOtpCheckoutREQ {
  @PhoneNumberValidator()
  phoneNumber: string;

  @OtpValidator()
  otpCode: string;
}

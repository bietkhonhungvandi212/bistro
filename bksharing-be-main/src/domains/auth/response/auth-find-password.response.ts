export class AuthFindPasswordRESP {
  phoneNumber: string;
  verificationCode: string;

  static fromBuyer(phoneNumber: string, verificationCode: string): AuthFindPasswordRESP {
    return { phoneNumber, verificationCode };
  }
}

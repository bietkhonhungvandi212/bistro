export const AUTH_CONSTANT = {
  OTP_CODE_LENGTH: 6, // 615123
  OTP_NEXT_SEND_TIMEOUT: 60, // 60 seconds
  OTP_EXPIRATION_TIMEOUT: 3 * 60, // 3 minutes
  OTP_SMS_MESSAGE: (otp: string) => `BK Sharing, register code is ${otp}`,
};

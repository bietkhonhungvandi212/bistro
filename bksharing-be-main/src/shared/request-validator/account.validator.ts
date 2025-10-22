import { IsEmail, IsLowercase, IsNotEmpty, IsNumberString, IsString, Length, Matches, MaxLength } from 'class-validator';
import { AUTH_CONSTANT } from '../constants/auth.constant';

export function PhoneNumberValidator() {
  return function (object: object, propertyName: string) {
    IsNumberString()(object, propertyName);
    Length(8, 12)(object, propertyName);
  };
}

export function UsernameValidator() {
  return function (object: object, propertyName: string) {
    IsString()(object, propertyName);
    Length(1, 20, { message: 'username should be between 1 and 20 characters' })(object, propertyName);
    Matches(/^[a-z][a-z0-9]{0,19}$/, {
      message: 'username should start with a lowercase English letter and can contain lowercase letters and numbers only',
    })(object, propertyName);
    IsLowercase({ message: 'username should be in lowercase' })(object, propertyName);
    IsNotEmpty({ message: 'username is required' })(object, propertyName);
  };
}

export function PasswordValidator() {
  return function (object: object, propertyName: string) {
    IsString()(object, propertyName);
    Length(6, 20, { message: 'password should be between 6 and 20 characters' })(object, propertyName);
    Matches(/^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]*$/, {
      message: 'password should contain a combination of English letters and numbers with optional special characters',
      each: true,
    })(object, propertyName);
  };
}

export function EmailValidator() {
  return function (object: object, propertyName: string) {
    IsString({ message: 'email must be a string' })(object, propertyName);
    IsEmail()(object, propertyName);
  };
}

export function NameValidator() {
  return function (object: object, propertyName: string) {
    IsString()(object, propertyName);
    IsNotEmpty()(object, propertyName);
    MaxLength(255)(object, propertyName);
  };
}

export function OtpValidator() {
  return function (object: object, propertyName: string) {
    IsNumberString()(object, propertyName);
    Length(AUTH_CONSTANT.OTP_CODE_LENGTH)(object, propertyName);
  };
}

export function AddressBaseValidator() {
  return function (object: object, propertyName: string) {
    IsString()(object, propertyName);
    MaxLength(255)(object, propertyName);
  };
}

export function AddressDetailValidator() {
  return function (object: object, propertyName: string) {
    IsString()(object, propertyName);
    MaxLength(255)(object, propertyName);
  };
}

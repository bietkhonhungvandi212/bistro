import { isEmpty, isNil } from 'lodash';
import { Nil } from '../generics/type.helper';

export const orEmptyString = (value?: any) => value || '';
export const orUndefined = (value?: any) => value || undefined;
export const orNull = (value?: any) => value || null;
export const orFalse = (value?: any) => value || false;
export const orDefault = (value?: any, defaultValue: any = null) => (isNil(value) ? defaultValue : value);
export const safeString = (value?: string | number | null, defaultValue = '') => (!isNil(value) ? `${value}` : defaultValue);
export const stringOrUndefined = (value: string | number | null | undefined | boolean) =>
  !isNil(value) ? `${value}` : undefined;
export const notEmptyOrNull = (value?: any) => (isEmpty(value) ? null : value);
export const stringOrNull = (value?: string | number | null) => (value ? `${value}` : null);
export const numberOrNull = (value?: Nil<string | number>) =>
  !isNil(value) ? (typeof value === 'string' ? parseInt(value) : value) : null;
export const numberOrUndefined = (value?: Nil<string | number>) =>
  !isNil(value) ? (typeof value === 'string' ? parseInt(value) : value) : undefined;
export const numberOrZero = (value?: Nil<string | number>) => (!value ? 0 : typeof value === 'string' ? parseInt(value) : value);
export const booleanToNumber = (value: boolean) => (value ? 1 : 0);
export const parseImage = (url: Nil<string>) => url || 'https://www.sikkimexpress.com/assets/frontend/images/no-image.png';
export const formatMoney = (money: number) => new Intl.NumberFormat('en-EN').format(money);
export const formatPhone = (phoneNumber?: string | null) => {
  if (!phoneNumber) return '';
  const cleaned = phoneNumber.replace(/\D/g, ''); // Remove any non-numeric characters from the input string
  const pattern = /^(.{3})(.{4})(.*)$/; // Define the format pattern
  const formatted = cleaned.replace(pattern, '$1-$2-$3'); // Apply the pattern and format the phone number accordingly
  return formatted;
};

export function deepFreeze<T>(object: T): T {
  Object.keys(object).forEach((prop) => {
    if (typeof object[prop] === 'object' && !Object.isFrozen(object[prop])) deepFreeze(object[prop]);
  });
  return Object.freeze(object);
}

export const orUndefinedWithCondition = (condition?: boolean, value?: any) => (condition ? orUndefined(value) : undefined);
export const orNullWithCondition = (condition?: boolean, value?: any) => (condition ? orNull(value) : null);

export const parseRoomChatId = (roomId: number) => {
  return `room_${roomId}`;
};

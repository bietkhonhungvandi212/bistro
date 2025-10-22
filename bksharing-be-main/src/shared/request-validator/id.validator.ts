import { IsNumber } from 'class-validator';

export function IdValidator() {
  return function (object: object, propertyName: string) {
    IsNumber()(object, propertyName);
  };
}

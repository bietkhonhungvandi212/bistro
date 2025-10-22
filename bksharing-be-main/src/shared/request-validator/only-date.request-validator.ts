import { registerDecorator, ValidationOptions } from 'class-validator';

export function OnlyDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'OnlyDate',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: {
        message: `${propertyName} must be date format eg: 30/10/2020`,
        ...validationOptions,
      },
      validator: {
        validate(value: any) {
          const regex = /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/[12]\d{3}$/;
          return typeof value === 'string' && regex.test(value);
        },
      },
    });
  };
}

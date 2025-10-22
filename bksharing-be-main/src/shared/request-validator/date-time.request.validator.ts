import { registerDecorator, ValidationOptions } from 'class-validator';

export function DateTimeValidator(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'DateTimeValidator',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: {
        message: `${propertyName} must be in the format DD/MM/YYYY HH:MM:SS`,
        ...validationOptions,
      },
      validator: {
        validate(value: any) {
          const regex = /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4} (0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
          return typeof value === 'string' && regex.test(value);
        },
      },
    });
  };
}

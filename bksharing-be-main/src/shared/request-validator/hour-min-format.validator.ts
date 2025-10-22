import { registerDecorator, ValidationOptions } from 'class-validator';

export function HourMinValidator(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'HourMinValidator',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: {
        message: `${propertyName} must be in the format HH:MM`,
        ...validationOptions,
      },
      validator: {
        validate(value: any) {
          const regex = /^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/;
          return typeof value === 'string' && regex.test(value);
        },
      },
    });
  };
}

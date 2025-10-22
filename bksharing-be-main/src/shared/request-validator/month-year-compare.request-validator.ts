import { ValidationArguments, ValidationOptions, registerDecorator } from 'class-validator';
import { parseDateMonthYear } from '../parsers/datetime.parse';

export function DateMonthYearCompare(
  validationOptions?: ValidationOptions & {
    startField: string;
  },
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'DateMonthYearCompare',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const endDate = value && parseDateMonthYear(value, 'end');
          const startStringDate = (args.object as any)[validationOptions.startField];
          const startDate = startStringDate && parseDateMonthYear(startStringDate, 'start');
          if (!endDate || !startDate) return true;
          return startDate.valueOf() < endDate.valueOf();
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        defaultMessage(validationArguments?: ValidationArguments) {
          return (validationOptions?.message as string) || `${validationOptions.startField} must less than ${propertyName}`;
        },
      },
    });
  };
}

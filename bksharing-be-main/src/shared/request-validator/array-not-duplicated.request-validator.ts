import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';
import { uniq } from 'lodash';

export function ArrayNotDuplicated<T>(classType: T | (new () => T), field?: keyof T, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'ArrayNotDuplicated',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [classType, field],
      options: validationOptions,
      validator: {
        validate(value: any[], args: ValidationArguments) {
          if (!Array.isArray(value) || !value.length) return true;
          const [type, field] = args.constraints;

          if (typeof type === 'function') {
            // Handle class type
            if (field) {
              const fieldValues = value.map((item) => item[field]);
              return uniq(fieldValues).length === fieldValues.length;
            }
            return uniq(value).length === value.length;
          } else if (typeof type === 'object') {
            // Handle enum or object type
            if (field && !Object.keys(type).includes(field as string)) {
              return false;
            }
            if (field) {
              const fieldValues = value.map((item) => item[field]);
              return uniq(fieldValues).length === fieldValues.length;
            }
            return uniq(value).length === value.length;
          }
          return false;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must not contain duplicated items`;
        },
      },
    });
  };
}

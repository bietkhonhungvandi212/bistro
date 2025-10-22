import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';
import { isNil, isNull, isUndefined } from 'lodash';

export function QueryArrayValidate(
  validationOptions?: ValidationOptions & {
    fieldType: 'number' | 'string';
    minSize?: number;
    maxSize?: number;
  },
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'QueryArrayValidate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string[] | number[], args: ValidationArguments) {
          if (isUndefined(value)) return true;
          if (isNull(value)) return false;
          if (!isNil(validationOptions.minSize) && value.length < validationOptions.minSize) return false;
          if (!isNil(validationOptions.maxSize) && value.length > validationOptions.maxSize) return false;
          return true;
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        defaultMessage(validationArguments?: ValidationArguments) {
          return (
            (validationOptions?.message as string) ||
            `${validationArguments.property} must be array format, eg: [1,2,3] or [name_1, name_2]`
          );
        },
      },
    });
  };
}

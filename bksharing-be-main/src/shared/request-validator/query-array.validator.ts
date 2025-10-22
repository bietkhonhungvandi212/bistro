import { Transform } from 'class-transformer';
import { QueryArrayValidate } from './query-array.validate';

export function QueryArray(options: { fieldType: 'number' | 'string'; minSize?: number; maxSize?: number }) {
  return function (object: object, propertyName: string) {
    QueryArrayValidate(options)(object, propertyName);
    Transform(({ value }) => {
      if (!value) return undefined;
      const numberRegex = /^\[\s*\d+(\s*,\s*\d+)*\s*\]$/;
      const stringRegex = /^\[\s*\w+(\s*,\s*\w+)*\s*\]$/;

      // Check if the transformation might have already been applied
      if (Array.isArray(value)) {
        console.log('Transformation previously applied, skipping.');
        return value;
      }

      if (options.fieldType === 'number' && !numberRegex.test(value)) return null;
      else if (options.fieldType === 'string' && !stringRegex.test(value)) return null;
      const param = String(value).replace('[', '').replace(']', '');
      const items = param.split(',').map((v) => v.trim());
      return items.map((i) => {
        return options.fieldType === 'number' ? Number.parseInt(i) : i;
      });
    })(object, propertyName);
  };
}

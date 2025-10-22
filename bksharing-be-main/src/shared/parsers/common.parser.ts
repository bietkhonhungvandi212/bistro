import { Decimal } from '@prisma/client/runtime/library';
import { IsArray } from 'class-validator';
import { isNil, omitBy } from 'lodash';
import { Nil } from '../generics/type.helper';
import { isBlank } from '../validators/query.validator';
import { notEmptyOrNull, orNull } from './io.parser';

export const parseEpoch = (value: Nil<bigint>) => orNull(value && String(value));
// export const parseSearchString = (value?: string) => value && value.trim().split(' ').join(' & ');
export const parsePrismaSearch = (key: string, value?: string) => {
  return {
    OR: [
      // notEmptyOrNull(leanObject({ [key]: { search: parseSearchString(value) } })),
      notEmptyOrNull(leanObject(value ? { [key]: { contains: value, mode: 'insensitive' } } : undefined)),
    ].filter((v) => !!v),
  };
};

export function leanObject(myObject: any) {
  if (typeof myObject !== 'object' || IsArray(myObject)) return myObject;
  const returnObject = {};
  for (const key2 of Object.keys(myObject)) {
    const afterClean = leanObject(myObject[key2]);
    returnObject[key2] = isBlank(afterClean) ? null : afterClean;
  }

  return omitBy(returnObject, isNil);
}

export const parseDecimalNumber = (value?: number | string | Decimal, fixed = 2): number => {
  if (isNil(value)) return 0;
  const roundedValue = parseFloat(Number(value).toFixed(fixed));
  return isNaN(roundedValue) ? 0 : roundedValue;
};

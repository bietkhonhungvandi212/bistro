import { Nil } from '../generics/type.helper';

export function generateSlug(str?: Nil<string>): string | undefined {
  if (!str) return undefined;
  return str.toLowerCase().replace(/ /g, '-');
}

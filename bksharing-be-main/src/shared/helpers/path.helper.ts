import { resolve } from 'path';

export const resolvePathFromRoot = (...paths: string[]): string => {
  return resolve(process.cwd(), ...paths);
};

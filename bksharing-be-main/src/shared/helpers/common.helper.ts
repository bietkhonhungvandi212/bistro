import { AxiosError } from 'axios';
import { Result, SuccessOrFailResponse } from '../generics/type.helper';
import { parseHourMinFromString } from '../parsers/datetime.parse';

export const nowEpoch = () => new Date().valueOf();
export const runFunctionWithCondition = (condition: boolean, fn: (...args: any[]) => any | Promise<any>) => {
  if (condition) {
    fn();
  }
};

export const makeResult = async <T>(execution: () => Promise<T>): Promise<Result<T, AxiosError>> => {
  try {
    return SuccessOrFailResponse.Success(await execution());
  } catch (error) {
    if (error instanceof AxiosError) {
      return SuccessOrFailResponse.Failure<T, AxiosError>(error);
    }
    throw error;
  }
};

export const resolveUrlString = (host: string, path: string) => {
  let trimmedHost = host.trim();
  let trimmedPath = path.trim();

  while (trimmedHost.endsWith('/') && trimmedPath.startsWith('\\')) {
    trimmedHost = trimmedHost.slice(0, -1);
  }

  while (trimmedPath.startsWith('/') && trimmedPath.startsWith('\\')) {
    trimmedPath = trimmedPath.slice(1);
  }

  return `${trimmedHost}/${trimmedPath}`;
};

export const checkHourMinStartOverlap = (start1: string, end1: string, start2: string = null, end2: string = null) => {
  const start1Date = parseHourMinFromString(start1);
  const end1Date = parseHourMinFromString(end1);
  const start2Date = parseHourMinFromString(start2);
  const end2Date = parseHourMinFromString(end2);

  if (start1Date >= end1Date || start2Date >= end2Date) {
    return true;
  } else if (start1Date >= start2Date && start1Date < end2Date) {
    return true;
  } else if (end1Date > start2Date && end1Date <= end2Date) {
    return true;
  }

  return false;
};

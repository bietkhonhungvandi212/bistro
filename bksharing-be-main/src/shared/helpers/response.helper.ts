import { ActionFailedException } from '../exceptions/action-failed.exception';
import { Result as ResultType } from '../generics/base.response';

export const Result = Object.freeze({
  Success: <T, E>(data: T): ResultType<T, E> => ({ success: true, data }),
  Failure: <T, E>(error: E): ResultType<T, E> => ({ success: false, error }),
});

export const makeResult = async <T>(execution: () => Promise<T>): Promise<ResultType<T, ActionFailedException>> => {
  try {
    return Result.Success(await execution());
  } catch (error) {
    if (error instanceof ActionFailedException) {
      return Result.Failure<T, ActionFailedException>(error);
    }
    throw error;
  }
};

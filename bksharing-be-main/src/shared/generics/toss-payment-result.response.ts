export type Success<T> = { success: true; _tag: 'Success'; data: T };
export type Failure<E> = { success: false; _tag: 'Failure'; error: E };
export type Result<T, E> = Success<T> | Failure<E>;

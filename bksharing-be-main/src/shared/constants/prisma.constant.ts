import { defaultSortAsc, defaultSortDesc } from '../helpers/query.helper';

export const PRE_FILTER_OPERATIONS = ['findMany', 'findFirst', 'findFirstOrThrow', 'findUnique', 'findUniqueOrThrow', 'count'];
export const TRANSACTION_TIMEOUT = { timeout: 10000 * 60 * 3, maxWait: 100000 };
export const IS_ACTIVE_NESTED = { isActive: true };
export const IS_INACTIVE_NESTED = { isActive: false };
export const ORDER_CREATED_AT_DESC = { orderBy: defaultSortDesc };
export const ORDER_CREATED_AT_ASC = { orderBy: defaultSortAsc };

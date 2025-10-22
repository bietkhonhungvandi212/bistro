import { SortOrder } from '../enums/query.enum';

export const defaultSortDesc: Record<string, SortOrder> = {
  createdAt: SortOrder.DESC,
};

export const defaultSortAsc: Record<string, SortOrder> = {
  createdAt: SortOrder.ASC,
};

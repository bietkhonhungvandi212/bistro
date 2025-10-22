import { nowEpoch } from 'src/shared/helpers/common.helper';
import { DateRangeFilter } from '../enums/common.enum';
import { getDiffOfTwoDays, getMillisecondsFromCurrentDate } from '../parsers/datetime.parse';

export const filterByDateRange = (dateRange: DateRangeFilter) => {
  switch (dateRange) {
    case DateRangeFilter.TODAY:
      return {
        createdAt: { gte: getMillisecondsFromCurrentDate({ days: 0, fromBeginning: true }) },
      };
    case DateRangeFilter.ONE_WEEK:
      return {
        createdAt: { gte: getMillisecondsFromCurrentDate({ days: 7, fromBeginning: true }) },
      };
    case DateRangeFilter.ONE_MONTH:
      return {
        createdAt: { gte: getMillisecondsFromCurrentDate({ months: 1, fromBeginning: true }) },
      };
    case DateRangeFilter.THREE_MONTHS:
      return {
        createdAt: { gte: getMillisecondsFromCurrentDate({ months: 3, fromBeginning: true }) },
      };
    case DateRangeFilter.SIX_MONTHS:
      return {
        createdAt: { gte: getMillisecondsFromCurrentDate({ months: 6, fromBeginning: true }) },
      };
    case DateRangeFilter.ONE_YEAR:
      return {
        createdAt: { gte: getMillisecondsFromCurrentDate({ years: 1, fromBeginning: true }) },
      };
    default:
      return {};
  }
};

export const getDiffDaysOfDateRange = (dateRange: DateRangeFilter) => {
  let diff: any;
  switch (dateRange) {
    case DateRangeFilter.TODAY:
      return 0;
    case DateRangeFilter.ONE_WEEK:
      return 7;
    case DateRangeFilter.ONE_MONTH:
      diff = getDiffOfTwoDays(getMillisecondsFromCurrentDate({ months: 1 }), nowEpoch());
      return diff.days;
    case DateRangeFilter.THREE_MONTHS:
      diff = getDiffOfTwoDays(getMillisecondsFromCurrentDate({ months: 3 }), nowEpoch());
      return diff.days;
    case DateRangeFilter.SIX_MONTHS:
      diff = getDiffOfTwoDays(getMillisecondsFromCurrentDate({ months: 6 }), nowEpoch());
      return diff.days;
    case DateRangeFilter.ONE_YEAR:
      diff = getDiffOfTwoDays(getMillisecondsFromCurrentDate({ years: 1 }), nowEpoch());
      return diff.days;
  }
};

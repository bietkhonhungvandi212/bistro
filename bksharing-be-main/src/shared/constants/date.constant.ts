export const DATE_FORMAT = {
  YEAR_MONTH: {
    HYPHEN: 'YYYY-MM',
    DOT: 'YYYY.MM',
  },
  DATE: {
    STICKY: 'YYYYMMDD',
    HYPHEN: 'YYYY-MM-DD',
    UNDERSCORE: 'YYYY_MM_DD',
    SLASH: 'YYYY/MM/DD',
    DOT: 'YYYY.MM.DD',
    STRING: 'MMMM DD, YYYY',
    TEXT: 'YYYY년 MM월 DD일',
    NO_SPACE: 'YYYYMMDD',
  },
  DATE_TIME: {
    HYPHEN: 'YYYY-MM-DD hh:mm',
    SLASH: 'YYYY/MM/DD hh:mm',
    DOT: 'YYYY.MM.DD hh:mm',
    DOWNLOAD: 'YYYY-MM-DD_hh:mm',
  },
  DATE_TIME_SECOND: {
    HYPHEN: 'YYYY-MM-DD hh:mm:ss',
    HYPHEN_V1: 'YYYY-MM-DD HH:mm:ss',
    SLASH: 'YYYY/MM/DD hh:mm:ss',
    DOT: 'YYYY.MM.DD hh:mm:ss',
    DOWNLOAD: 'YYYY-MM-DD_hh:mm:ss',
    NO_SPACE: 'YYYYMMDDHHmmss',
    ISO8601: 'YYYY-MM-DDThh:mm:ss',
    ISO8601_BEGIN: 'YYYY-MM-DDT00:00:00',
    ISO8601_END: 'YYYY-MM-DDT23:59:59',
  },
  TIME: {
    _12H: 'A hh:mm',
    _12H_PICKER: 'hh:mm A',
    _24H: 'H:m',
  },
  MONTH_YEAR: 'MM-YYYY',
};

export const NO_MONTHS_OF_YEAR = 12;
export const EXCEL_DATE_FORMAT = DATE_FORMAT.DATE.HYPHEN;

export const DAY_OF_WEEK = {
  0: 'SUNDAY',
  1: 'MONDAY',
  2: 'TUESDAY',
  3: 'WEDNESDAY',
  4: 'THURSDAY',
  5: 'FRIDAY',
  6: 'SATURDAY',
};

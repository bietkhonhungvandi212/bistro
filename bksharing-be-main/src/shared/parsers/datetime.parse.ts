import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import uct from 'dayjs/plugin/utc';
import { DATE_FORMAT } from '../constants/date.constant';
import { Nil } from '../generics/type.helper';
import { orNullWithCondition } from './io.parser';

dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);
dayjs.extend(duration);
dayjs.extend(uct);
dayjs.extend(timezone);

dayjs.tz.setDefault('Asia/Ho_Chi_Minh');

export const parseDatetimeISO8601 = (date: Nil<string>, defaultValue = undefined) => {
  const dateAfterParse = parseDateMonthYear(date, 'start');
  return !dateAfterParse ? defaultValue : dayjs(dateAfterParse).format(DATE_FORMAT.DATE_TIME_SECOND.ISO8601);
};

export const parseAndAddMinutes = (datetimeStr: Nil<string>, minutesToAdd: number = 0, format?: string) => {
  const formatOrDefault = format ? format : DATE_FORMAT.DATE_TIME_SECOND.ISO8601;
  // Parse the datetime string into a dayjs object
  const parsedDatetime = datetimeStr ? dayjs(datetimeStr, formatOrDefault).tz() : dayjs().tz();

  // Add the specified number of minutes
  const updatedDatetime = parsedDatetime.add(minutesToAdd, 'minute');

  // Format it back to the original format
  return updatedDatetime.format(formatOrDefault);
};

export const parsePrismaDate = (date: Nil<string>) => (date ? parseDatetimeISO8601(date) + 'Z' : date);

export const parseDateToEpoch = (date: Nil<Date | string>) => (date ? dayjs(date).valueOf() : date);

export const parseQueryDate = (date: Nil<Dayjs>, defaultValue: any = null) =>
  date ? date.format(DATE_FORMAT.DATE.HYPHEN) : defaultValue;

const parseApplyMonth = (month: number) => String(month).padStart(2, '0');

export const parseDateMonthYear = (date: Nil<string>, position: 'start' | 'end') => {
  const parsedDate = date ? fromDateMonthYear(date.split('/')[0], date.split('/')[1], date.split('/')[2])(position) : undefined;

  return parsedDate;
};

export const parsePadDate = (value: string | number) => String(value).padStart(2, '0');

export const fromDateMonthYear =
  (date: string | number, month: number | string, year: number | string) => (position: 'start' | 'end') => {
    const dateAfterParse = dayjs(`${year}-${parseApplyMonth(+month)}-${parsePadDate(date)}T00:00:00.000Z`).utc();
    if (position === 'start') return dateAfterParse.startOf('date');
    else return dateAfterParse.endOf('date');
  };

export const fromDateTimeMonthYear = (
  time: string | number,
  date: string | number,
  month: number | string,
  year: number | string,
) => {
  const dateAfterParse = dayjs(`${year}-${parseApplyMonth(+month)}-${parsePadDate(date)}T${parsePadDate(time)}:00.000Z`).utc();
  return dateAfterParse;
};

//parse date time in this format DD/MM/YY HH:MM:SS to Epoch dont use dayjs
export const parseDateTimeRequestToEpoch = (date: Nil<string>) => {
  if (!date) return undefined;
  const [day, month, year, hour, minute, second] = date.split(/[\/ :]/).map((value) => parseInt(value));
  const dateAfterParse = new Date(year, month - 1, day, hour, minute, second);
  return dateAfterParse.getTime();
};

export const parseDateTimeToEpochV2 = (date: Nil<string>) => {
  if (!date) return undefined;
  //2024-12-07T23:00:00.000Z
  const [year, month, day, hour, minute, second] = date.split(/[-T:.]/).map((value) => parseInt(value));

  const dateAfterParse = new Date(year, month - 1, day, hour, minute, second);
  return dateAfterParse.getTime();
};

export const checkDateIsBeforeNow = (date: string) => {
  const now = dayjs().tz().valueOf();
  const epoch = dayjs(date).tz().valueOf();

  return epoch < now;
};

export const parsePrismaDateToEpoch = (date: Date | string) => orNullWithCondition(!!date, dayjs(date).valueOf().toString());

export const parseDateTimeNowFormat = (format: string) => dayjs().format(format);

export const parseHourMinFromString = (hourMin: string) => dayjs(`2021-01-01T${hourMin}`).tz().format('HH:mm');

export const parseEpochToDate = (epoch: Nil<number>) => {
  if (!epoch) return undefined;
  return dayjs(epoch).tz().format(DATE_FORMAT.DATE_TIME_SECOND.HYPHEN_V1);
};

export const parseDateToHyphen = (date: Nil<string>) => {
  if (!date) return undefined;
  const [day, month, year] = date.split('/').map((value) => parseInt(value));

  return dayjs(`${year}-${month}-${day}`).format(DATE_FORMAT.DATE.HYPHEN);
};

//Get MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY
export const getDayOfWeek = (date: string) => dayjs(date).day();

export const getMillisecondsFromCurrentDate = ({
  days = 0,
  months = 0,
  years = 0,
  fromBeginning = false,
  fromEnding = false,
}: {
  days?: number;
  months?: number;
  years?: number;
  fromBeginning?: boolean;
  fromEnding?: boolean;
}) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setMonth(date.getMonth() - months);
  date.setFullYear(date.getFullYear() - years);
  if (fromBeginning) date.setHours(0, 0, 0, 0);
  if (fromEnding) date.setHours(23, 59, 59, 999);
  return date.valueOf();
};

export const getDiffOfTwoDays = (startDay: string | number | Date, endDay: string | number | Date) => {
  const from = dayjs(startDay).tz();
  const end = dayjs(endDay).tz();

  const duration = dayjs.duration(end.diff(from));

  const years = Math.floor(duration.asYears());
  const months = Math.floor(duration.asMonths());
  const days = Math.floor(duration.asDays());
  const hours = Math.floor(duration.asHours());
  const minutes = Math.floor(duration.asMinutes());
  const seconds = Math.floor(duration.asSeconds());

  return { years, months, days, hours, minutes, seconds };
};

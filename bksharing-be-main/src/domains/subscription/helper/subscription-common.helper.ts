import { ActionFailed, ActionFailedException } from 'src/shared/exceptions/action-failed.exception';
import { parseDateTimeToEpochV2 } from 'src/shared/parsers/datetime.parse';

export const parseBookingDateTimeToEpoch = (date: string, time: string) => {
  const [day, month, year] = date.split('/');
  const [hour, minute] = time.split(':');

  if (!time) throw new ActionFailedException(ActionFailed.DATE_TIME_INVALID);

  const dateAfterParse = new Date(`${year}-${month}-${day}T${hour}:${minute}:00.00Z`);

  const epoch = parseDateTimeToEpochV2(dateAfterParse.toISOString());

  const now = Date.now();

  if (epoch < now) throw new ActionFailedException(ActionFailed.SUBSCRIPTION_DATE_REGISTERED_MUST_AFTER_NOW);

  return epoch;
};

export const compareDateFromEpoch = (epoch1: number, epoch2: number) => {
  const date1 = new Date(epoch1);
  const date2 = new Date(epoch2);

  return (
    date1.getDate() === date2.getDate() && date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear()
  );
};

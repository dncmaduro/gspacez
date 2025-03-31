import {
  format,
  differenceInSeconds,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
} from 'date-fns';
import { DATE_COMMENT_FORMAT } from './constants';
  
export const convertTime = (createdAt: Date, updatedAt?: Date | null) => {
  const now = new Date();
  const isUpdated = !! updatedAt;
  const time = isUpdated ? updatedAt! : createdAt;

  const seconds = differenceInSeconds(now, time);
  const minutes = differenceInMinutes(now, time);
  const hours = differenceInHours(now, time);
  const days = differenceInDays(now, time);
  const weeks = differenceInWeeks(now, time);
  const months = differenceInMonths(now, time);

  let timeString = '';
  if (seconds < 10) timeString = 'Just now';
  else if (seconds < 60) timeString = `${seconds} seconds ago`;
  else if (minutes < 60) timeString = `${minutes} minutes ago`;
  else if (hours < 24) timeString = `${hours} hours ago`;
  else if (days < 7) timeString = `${days} days ago`;
  else if (weeks < 4) timeString = `${weeks} weeks ago`;
  else if (months < 12) timeString = format(time, DATE_COMMENT_FORMAT.replace(/, \d{4}$/, ''));
  else timeString = format(time, DATE_COMMENT_FORMAT);

  if (isUpdated) {
    timeString = timeString.includes('ago')
      ? `Modified ${timeString}`
      : `Modified on ${timeString}`;
  }

  return timeString;
}

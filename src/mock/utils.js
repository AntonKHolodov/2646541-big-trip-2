import dayjs from 'dayjs';
import { getRandomPositiveInteger } from '../utils/common.js';
import { Duration } from '../const.js';

let date = dayjs().subtract(getRandomPositiveInteger(0, Duration.DAY), 'day').toDate();

function getDate({ next }) {
  const minsGap = getRandomPositiveInteger(0, Duration.MIN);
  const hoursGap = getRandomPositiveInteger(0, Duration.HOUR);
  const daysGap = getRandomPositiveInteger(0, Duration.DAY);

  if (next) {
    date = dayjs(date)
      .add(minsGap, 'minute')
      .add(hoursGap, 'hour')
      .add(daysGap, 'day')
      .toDate();
  }

  return date;
}

export { getDate };


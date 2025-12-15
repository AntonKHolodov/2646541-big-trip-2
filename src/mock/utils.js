import dayjs from 'dayjs';
import { getRandomPositiveInteger } from '../utils/common.js';
import { DURATION } from '../const';

let date = dayjs().subtract(getRandomPositiveInteger(0, DURATION.day), 'day').toDate();

function getDate({ next }) {
  const minsGap = getRandomPositiveInteger(0, DURATION.min);
  const hoursGap = getRandomPositiveInteger(0, DURATION.hour);
  const daysGap = getRandomPositiveInteger(0, DURATION.day);

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


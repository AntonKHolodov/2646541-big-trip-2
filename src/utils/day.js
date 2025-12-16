import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

// Работа с датой

dayjs.extend(duration);
dayjs.extend(relativeTime);

const MSEC_IN_SEC = 1000;
const SEC_IN_MIN = 60;
const MIN_IN_HOUR = 60;
const HOUR_IN_DAY = 24;

const MSEC_IN_HOUR = MIN_IN_HOUR * SEC_IN_MIN * MSEC_IN_SEC;

const MSEC_IN_DAY = HOUR_IN_DAY * MSEC_IN_HOUR;

function formatStringToDayTime(date) {
  return date === null ? '' : dayjs(date).format('YY-MM-DD HH:mm');
}

function formatStringToShortDate(date) {
  return date === null ? '' : dayjs(date).format('MMM DD');
}

function formatStringToTime(date) {
  return dayjs(date).format('HH:mm');
}

function getPointDuration(dateFrom, dateTo) {
  const timeDiff = dayjs(dateTo).diff(dayjs(dateFrom));

  let pointDuration = 0;

  if (timeDiff >= MSEC_IN_DAY) {
    pointDuration = dayjs.duration(timeDiff).format('DD[D] HH[H] mm[M]');
  } else if (timeDiff >= MSEC_IN_HOUR) {
    pointDuration = dayjs.duration(timeDiff).format('HH[H] mm[M]');
  } else if (timeDiff >= MIN_IN_HOUR) {
    pointDuration = dayjs.duration(timeDiff).format('mm[M]');
  } else {
    pointDuration = dayjs.duration(timeDiff).format('m[M]');
  }

  return pointDuration;
}

function getScheduleDate(date) {
  return dayjs(date).format('DD/MM/YY HH:mm');
}

function isPointFuture(point) {
  return dayjs().isBefore(point.dateFrom);
}

function isPointPresent(point) {
  return dayjs().isBefore(point.dateTo) && dayjs().isAfter(point.dateFrom);
}

function isPointPast(point) {
  return dayjs().isAfter(point.dateTo);
}

function getPointsPriceDifference(pointA, pointB) {
  return pointB.basePrice - pointA.basePrice;
}

function isBigDifference(pointA, pointB) {
  return pointA.dateFrom !== pointB.dateFrom
  || pointA.basePrice !== pointB.basePrice
  || getPointDuration(pointA.dateFrom, pointA.dateTo) !== getPointDuration(pointB.dateFrom, pointB.dateTo);
}

export {
  formatStringToDayTime,
  formatStringToShortDate,
  formatStringToTime,
  getPointDuration,
  getScheduleDate,
  isPointFuture,
  isPointPresent,
  isPointPast,
  getPointsPriceDifference,
  isBigDifference
};

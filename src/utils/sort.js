import dayjs from 'dayjs';

const sortPointByTime = (pointA, pointB) => {
  const durationPointA = dayjs(pointA.dateTo).valueOf() - dayjs(pointA.dateFrom).valueOf();
  const durationPointB = dayjs(pointB.dateTo).valueOf() - dayjs(pointB.dateFrom).valueOf();

  return durationPointB - durationPointA;
};

const sortPointByPrice = (pointA, pointB) => pointB.basePrice - pointA.basePrice;

const sortPointByDay = (pointA, pointB) => {
  const dateA = dayjs(pointA.dateFrom).valueOf();
  const dateB = dayjs(pointB.dateFrom).valueOf();

  return dateA - dateB;
};

export { sortPointByTime, sortPointByPrice, sortPointByDay };

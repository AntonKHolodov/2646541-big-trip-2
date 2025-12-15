import { isPointFuture, isPointPresent, isPointPast } from './day.js';
import { FILTER } from '../const';

const filter = {
  [FILTER.everything]: (points) => [...points],
  [FILTER.future]: (points) => points.filter((point) => isPointFuture(point)),
  [FILTER.present]: (points) => points.filter((point) => isPointPresent(point)),
  [FILTER.past]: (points) => points.filter((point) => isPointPast(point)),
};

export { filter };

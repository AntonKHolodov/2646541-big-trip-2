import { getRandomPositiveInteger } from '../utils/common.js';
import { Price } from '../const.js';
import { getDate } from './utils.js';

function generateMockPoint(type, destinationId, offerIds) {
  return {
    id: crypto.randomUUID(),
    basePrice: getRandomPositiveInteger(Price.MIN, Price.MAX),
    dateFrom: getDate({ next: false }),
    dateTo: getDate({ next: true }),
    destination: destinationId,
    isFavorite: !!getRandomPositiveInteger(0, 1),
    offers: offerIds,
    type,
  };
}

export { generateMockPoint };


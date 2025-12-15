import { getRandomPositiveInteger, getRandomArrayElement } from '../utils/common.js';
import { OFFERS, PRICE } from '../const.js';

function generateMockOffer() {
  return {
    id: crypto.randomUUID(),
    title: getRandomArrayElement(OFFERS),
    price: getRandomPositiveInteger(PRICE.min, PRICE.max),
  };
}

export { generateMockOffer };


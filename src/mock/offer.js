import { getRandomPositiveInteger, getRandomArrayElement } from '../utils/common.js';
import { OFFERS, Price } from '../const.js';

function generateMockOffer() {
  return {
    id: crypto.randomUUID(),
    title: getRandomArrayElement(OFFERS),
    price: getRandomPositiveInteger(Price.MIN, Price.MAX),
  };
}

export { generateMockOffer };


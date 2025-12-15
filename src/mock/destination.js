import { getRandomArrayElement } from '../utils/common.js';
import { CITIES, DESCRIPTIONS } from '../const.js';

function generateMockDestination() {
  const city = getRandomArrayElement(CITIES);
  const description = getRandomArrayElement(DESCRIPTIONS);
  return {
    id: crypto.randomUUID(),
    description,
    name: city,
    pictures: [{
      src: `https://loremflickr.com/248/152?random=${crypto.randomUUID()}`,
      description: `${city} ${description}`,
    }],
  };
}

export { generateMockDestination };


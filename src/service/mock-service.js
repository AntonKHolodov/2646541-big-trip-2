import { getRandomPositiveInteger, getRandomArrayElement } from '../utils.js';

import { generateMockDestination } from '../mock/destination.js';
import { generateMockOffer } from '../mock/offer.js';
import { generateMockPoint } from '../mock/point.js';

import {
  TYPES,
  DESTINATION_COUNT,
  OFFER_COUNT,
  POINT_COUNT,
} from '../const.js';

export default class MockService {
  constructor() {
    this.destinations = this.generateMockDestinations();
    this.offers = this.generateMockOffers();
    this.points = this.generateMockPoints();
  }

  getDestinations() {
    return this.destinations;
  }

  getOffers() {
    return this.offers;
  }

  getPoints() {
    return this.points;
  }

  generateMockDestinations() {
    return Array.from({ length: DESTINATION_COUNT }, () =>
      generateMockDestination()
    );
  }

  generateMockOffers() {
    return TYPES.map((type) => ({
      type,
      offers: Array.from(
        { length: getRandomPositiveInteger(0, OFFER_COUNT) },
        () => generateMockOffer()
      ),
    }));
  }

  generateMockPoints() {
    return Array.from({ length: POINT_COUNT }, () => {
      const type = getRandomArrayElement(TYPES);
      const destination = getRandomArrayElement(this.destinations);

      const hasOffers = getRandomPositiveInteger(0, 1);
      const offersByType = this.offers.find(
        (offerByType) => offerByType.type === type
      );

      const offersIds = hasOffers
        ? offersByType.offers
          .slice(0, getRandomPositiveInteger(0, 5))
          .map((offer) => offer.id)
        : [];

      return generateMockPoint(type, destination.id, offersIds);
    });
  }
}

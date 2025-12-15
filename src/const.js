const TYPES = [
  'Taxi',
  'Bus',
  'Train',
  'Ship',
  'Drive',
  'Flight',
  'Check-in',
  'Sightseeing',
  'Restaurant',
];

const DESCRIPTIONS = [
  'lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'cras aliquet varius magna, non porta ligula feugiat eget.',
  'fusce tristique felis at fermentum pharetra.',
  'aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
];

const CITIES = [
  'Amsterdam',
  'Chamonix',
  'Geneva',
  'Barcelona',
  'Kyoto',
  'Sydney',
  'Vancouver',
];

const OFFERS = [
  'Add luggage',
  'Switch to comfort',
  'Order Uber',
  'Add meal',
  'Travel by train',
];

const PRICE = {
  min: 20,
  max: 2000,
};

const DURATION = {
  hour: 2,
  day: 1,
  min: 20,
};

const DESTINATION_COUNT = 3;

const OFFER_COUNT = 3;

const POINT_COUNT = 6;

const POINT_BLANCK = {
  basePrice: 0,
  dateFrom: null,
  dateTo: null,
  destination: null,
  isFavorite: false,
  offers: [],
  type: 'Taxi',
};

const FILTER = {
  everything: 'Everything',
  future:'Future',
  present:'Present',
  past: 'Past',
};

export { TYPES, DESCRIPTIONS, CITIES, OFFERS, PRICE, DURATION, DESTINATION_COUNT, OFFER_COUNT, POINT_COUNT, POINT_BLANCK, FILTER };

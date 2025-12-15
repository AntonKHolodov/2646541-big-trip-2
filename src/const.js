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

const Price = {
  MIN: 20,
  MAX: 2000,
};

const Duration = {
  HOUR: 2,
  DAY: 1,
  MIN: 20,
};

const DESTINATION_COUNT = 3;

const OFFER_COUNT = 3;

const POINT_COUNT = 6;

const FilterType = {
  EVERYTHING: 'Everything',
  FUTURE:'Future',
  PRESENT:'Present',
  PAST: 'Past',
};

const Mode = {
  DEFAULT: 'default',
  EDITING: 'editing',
};

const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
};

export { TYPES, DESCRIPTIONS, CITIES, OFFERS, Price, Duration, DESTINATION_COUNT, OFFER_COUNT, POINT_COUNT, FilterType, Mode, SortType };

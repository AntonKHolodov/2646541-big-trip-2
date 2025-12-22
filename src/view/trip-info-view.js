import AbstractView from '../framework/view/abstract-view.js';
import he from 'he';

const createTripRouteTitle = (routePoints) => {
  const names = routePoints.map((p) => p.name).filter(Boolean);

  if (names.length === 0) {
    return '';
  }

  if (names.length <= 3) {
    return names.join(' &mdash; ');
  }

  return `${names[0]} &mdash; ... &mdash; ${names[names.length - 1]}`;
};

const createTripDateRange = (dateFrom, dateTo, formatter) => {
  if (!dateFrom || !dateTo) {
    return '';
  }

  const start = formatter(dateFrom, 'MMM D');
  const endSameMonth = formatter(dateTo, 'D');
  const endOtherMonth = formatter(dateTo, 'MMM D');

  // If same month, show "Mar 18 — 20", otherwise "Mar 18 — Apr 2"
  const sameMonth = formatter(dateFrom, 'MMM') === formatter(dateTo, 'MMM');

  return sameMonth
    ? `${start}&nbsp;&mdash;&nbsp;${endSameMonth}`
    : `${start}&nbsp;&mdash;&nbsp;${endOtherMonth}`;
};

function createTripInfoTemplate({ routePoints, dateFrom, dateTo, totalCost }, formatter) {
  // If there is no data yet, render an empty container to keep layout stable
  if (!routePoints || routePoints.length === 0 || !dateFrom || !dateTo) {
    return '<section class="trip-main__trip-info  trip-info"></section>';
  }

  const title = createTripRouteTitle(routePoints);
  const dates = createTripDateRange(dateFrom, dateTo, formatter);

  return `
    <section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${he.encode(title)}</h1>
        <p class="trip-info__dates">${dates}</p>
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
      </p>
    </section>
  `;
}

export default class TripInfoView extends AbstractView {
  #data;
  #formatter;

  constructor({ data, formatter }) {
    super();
    this.#data = data;
    this.#formatter = formatter;
  }

  get template() {
    return createTripInfoTemplate(this.#data, this.#formatter);
  }
}

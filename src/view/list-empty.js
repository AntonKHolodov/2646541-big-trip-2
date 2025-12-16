import AbstractView from '../framework/view/abstract-view.js';

const NoPointsTextType = {
  EVERYTHING: 'Click New Event to create your first point',
  FUTURE: 'There are no future events now',
  PRESENT: 'There are no present events now',
  PAST: 'There are no past events now',
};

function createEmptyListTemplate({filterText}) {
  return `
      <p class="trip-events__msg">
        ${filterText}
      </p>
    `;
}

export default class EmptyListView extends AbstractView {
  #filterType = null;

  constructor({filterType}) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createEmptyListTemplate({filterText: NoPointsTextType[(this.#filterType).toUpperCase()]});
  }
}

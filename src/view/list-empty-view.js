import AbstractView from '../framework/view/abstract-view.js';
import { NoPointsTextType } from '../const.js';

function createEmptyListTemplate({filterText}) {
  return `
      <p class="trip-events__msg">
        ${filterText}
      </p>
    `;
}

export default class ListEmptyView extends AbstractView {
  #filterType = null;

  constructor({filterType}) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createEmptyListTemplate({filterText: NoPointsTextType[(this.#filterType).toUpperCase()]});
  }
}

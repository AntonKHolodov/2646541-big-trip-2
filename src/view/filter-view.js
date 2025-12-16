import AbstractView from '../framework/view/abstract-view.js';

function createFilterItemTemplate({ type, isChecked, isDisabled }) {
  return `
    <div class="trip-filters__filter">
      <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}" data-item="${type}"
      ${isChecked ? 'checked' : ''}
      ${isDisabled ? 'disabled' : ''}
      >
      <label class="trip-filters__filter-label" for="filter-${type}">${type}</label>
    </div>`;
}

function createFilterTemplate(filters) {
  return (
    `<form class="trip-filters" action="#" method="get">
      ${filters.map(createFilterItemTemplate).join(' ')}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
    `
  );
}

export default class FilterView extends AbstractView {
  _items = [];
  _handleItemChange = null;

  constructor({items, onFilterTypeChange}) {
    super();
    this._items = items;
    this._handleFilterTypeChange = onFilterTypeChange;
    this.element.addEventListener('change', this.#filterTypeChangeHandler);

  }

  get template() {
    return createFilterTemplate(this._items);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this._handleFilterTypeChange(evt.target.dataset.item);
  };
}


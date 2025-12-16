import FilterView from '../view/filter-view.js';
import { render, replace, remove } from '../framework/render.js';
import { filter } from '../utils/filter.js';
import { UpdateType } from '../const.js';

export default class FilterPresenter {
  #pointsModel = null;
  #container = null;
  #filterModel = [];
  #currentFilter = null;
  #filterComponent = null;

  constructor({ pointsModel, container, filterModel }) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const points = this.#pointsModel.get();

    return Object.entries(filter).map(([filterType, filterPoints]) => ({
      type: filterType,
      isChecked: filterType === this.#currentFilter,
      isDisabled: filterPoints(points).length === 0
    }));
  }

  init() {
    this.#currentFilter = this.#filterModel.get();
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView({
      items: filters,
      onFilterTypeChange: this.#handleFilterTypeChange
    });

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#container);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #handleFilterTypeChange = (filterType) => {
    this.#filterModel.set(UpdateType.MAJOR, filterType);
  };

  #handleModelEvent = () => {
    this.init();
  };
}


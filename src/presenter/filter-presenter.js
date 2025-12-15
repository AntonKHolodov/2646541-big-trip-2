import FilterView from '../view/filter-view.js';
import { generateFilter } from '../mock/filter.js';
import { render } from '../framework/render.js';

export default class FilterPresenter {
  #pointsModel = null;
  #filterElement = null;
  #filters = [];

  constructor({ pointsModel, filterElement }) {
    this.#pointsModel = pointsModel;
    this.#filterElement = filterElement;
    this.#filters = generateFilter(this.#pointsModel.get());
  }

  init() {
    render(new FilterView({ filters: this.#filters }), this.#filterElement);
  }
}

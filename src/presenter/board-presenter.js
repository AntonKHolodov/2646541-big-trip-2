import SortView from '../view/sort-view.js';
import EditList from '../view/event-list-view.js';
import PointPresenter from './point-presenter.js';
import { render } from '../framework/render.js';
import EmptyListView from '../view/list-empty.js';
import { updateItem } from '../utils/common.js';

export default class BoardPresenter {
  #sortComponent = new SortView();
  #editListComponent = new EditList();
  #container = null;
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #points = [];

  #pointPresenters = new Map();

  constructor({ container, destinationsModel, offersModel, pointsModel }) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#points = [...this.#pointsModel.get()];
  }

  init() {
    this.#renderBoard();
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handlePointsChange = (updatedTask) => {
    this.#points = updateItem(this.#points, updatedTask);
    this.#pointPresenters.get(updatedTask.id).init(updatedTask);
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter({
      container: this.#editListComponent.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#handlePointsChange,
      onModeChange: this.#handleModeChange
    });

    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  };

  #renderPoints = () => {
    this.#points.forEach((point) => {
      this.#renderPoint(point);
    });
  };

  #clearPoints() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #renderSort = () => {
    render(this.#sortComponent, this.#container);
  };

  #renderPointContainer = () => {
    render(this.#editListComponent, this.#container);
  };

  #renderEmpty = () => {
    if (this.#points.length === 0) {
      render(new EmptyListView(), this.#container);
    }
  };

  #renderBoard = () => {
    this.#renderSort();
    this.#renderEmpty();
    this.#renderPointContainer();
    this.#renderPoints();
  };
}

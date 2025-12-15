import SortView from '../view/sort-view.js';
import EditList from '../view/event-list-view.js';
import PointPresenter from './point-presenter.js';
import { render } from '../framework/render.js';
import EmptyListView from '../view/list-empty.js';
import { updateItem } from '../utils/common.js';
import { SortType } from '../const.js';
import { sortPointByTime, sortPointByPrice, sortPointByDay } from '../utils/sort.js';

export default class BoardPresenter {
  #sortComponent = null;
  #currentSortType = SortType.DAY;
  #sourcedPoints = [];
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
    this.#sourcedPoints = [...this.#pointsModel.get()];
  }

  init() {
    this.#renderBoard();
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handlePointsChange = (updatedPoints) => {
    this.#points = updateItem(this.#points, updatedPoints);
    this.#sourcedPoints = updateItem(this.#sourcedPoints, updatedPoints);
    this.#pointPresenters.get(updatedPoints.id).init(updatedPoints);
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
    this.#sortComponent = new SortView({
      onSortTypeChange: this.#handleSortTypeChange
    });
    render(this.#sortComponent, this.#container);
  };

  #sortPoints(sortType) {
    switch (sortType) {
      case SortType.TIME:
        this.#points.sort(sortPointByTime);
        break;
      case SortType.PRICE:
        this.#points.sort(sortPointByPrice);
        break;
      case SortType.DAY:
        this.#points.sort(sortPointByDay);
        break;
      default:
        this.#points = [...this.#sourcedPoints];
    }

    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoints(sortType);
    this.#clearPoints();
    this.#renderPoints();
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

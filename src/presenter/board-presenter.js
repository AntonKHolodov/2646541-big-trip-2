import SortView from '../view/sort-view.js';
import EditList from '../view/event-list-view.js';
import PointPresenter from './point-presenter.js';
import { render, remove } from '../framework/render.js';
import EmptyListView from '../view/list-empty.js';
import { SortType, FilterType, UpdateType, UserAction } from '../const.js';
import { sortPointByTime, sortPointByPrice, sortPointByDay } from '../utils/sort.js';
import { filter } from '../utils/filter.js';
import NewPointPresenter from './new-point-presenter.js';

export default class BoardPresenter {
  #sortComponent = null;
  #currentSortType = SortType.DAY;
  #editListComponent = new EditList();
  #container = null;
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #filterModel = null;
  #pointPresenters = new Map();
  #newPointPresenter = null;
  #newPointButtonPresenter = null;
  #isCreating = false;
  #noPointsComponent = null;

  constructor({ container, destinationsModel, offersModel, pointsModel, filterModel, newPointButtonPresenter }) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#filterModel = filterModel;
    this.#newPointButtonPresenter = newPointButtonPresenter;

    this.#newPointPresenter = new NewPointPresenter({
      container: this.#editListComponent.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#handleViewAction,
      onDestroy: this.#newPointDestroyHandler,
    });
    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    const filterType = this.#filterModel.get();
    const filteredPoints = filter[filterType](this.#pointsModel.get());
    switch (this.#currentSortType) {
      case SortType.TIME:
        return filteredPoints.sort(sortPointByTime);
      case SortType.PRICE:
        return filteredPoints.sort(sortPointByPrice);
      case SortType.DAY:
        return filteredPoints.sort(sortPointByDay);
    }
    return filteredPoints;
  }

  init() {
    this.#renderBoard();
  }

  newPointButtonClickHandler = () => {
    this.#isCreating = true;
    this.#currentSortType = SortType.DAY;
    this.#filterModel.set(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointButtonPresenter.disableButton();
    this.#newPointPresenter.init();
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
    this.#newPointPresenter.destroy();
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter({
      container: this.#editListComponent.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });

    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  };

  #renderPoints = () => {
    this.points.forEach((point) => {
      this.#renderPoint(point);
    });
  };

  #clearPoints() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
    this.#newPointPresenter.destroy();
  }

  #renderSort = () => {
    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });
    render(this.#sortComponent, this.#container);
  };

  #clearBoard = ({resetSortType = false} = {}) => {
    this.#clearPoints();
    remove(this.#sortComponent);
    this.#sortComponent = null;

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }

    if (this.#noPointsComponent) {
      remove(this.#noPointsComponent);
    }

  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.update(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.add(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.delete(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters?.get(data.id)?.init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetSortType: true});
        this.#renderBoard();
        break;
    }
  };

  #newPointDestroyHandler = ({isCanceled}) => {
    this.#isCreating = false;
    this.#newPointButtonPresenter.enableButton();
    if(this.points.length === 0 && isCanceled) {
      this.#clearBoard();
      this.#renderBoard();
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearPoints();
    this.#renderPoints();
  };

  #renderPointContainer = () => {
    render(this.#editListComponent, this.#container);
  };

  #renderNoPoints() {
    this.#noPointsComponent = new EmptyListView({
      filterType: this.#filterModel.get()
    });

    render(this.#noPointsComponent, this.#container);
  }

  #renderBoard = () => {
    if(this.points.length === 0 && !this.#isCreating) {
      this.#renderNoPoints();
      return;
    }
    this.#renderSort();
    this.#renderPointContainer();
    this.#renderPoints();
  };
}

import SortView from '../view/sort-view.js';
import EditList from '../view/event-list-view.js';
import PointPresenter from './point-presenter.js';
import { render, remove } from '../framework/render.js';
import EmptyListView from '../view/list-empty.js';
import { SortType, FilterType, UpdateType, UserAction, TimeLimit } from '../const.js';
import { sortPointByTime, sortPointByPrice, sortPointByDay } from '../utils/sort.js';
import { filter } from '../utils/filter.js';
import NewPointPresenter from './new-point-presenter.js';
import LoadingView from '../view/loading-view.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import FailedLoadingView from '../view/failed-loading-view.js';

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
  #loadingComponent = new LoadingView();
  #failedLoadingComponent = new FailedLoadingView();
  #isLoading = true;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

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
    remove(this.#noPointsComponent);
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
    remove(this.#loadingComponent);
    if (this.#noPointsComponent) {
      remove(this.#noPointsComponent);
    }

  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenters.get(update.id).setSaving();
        try {
          await this.#pointsModel.update(updateType, update);
        } catch(err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.add(updateType, update);
        } catch(err) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenters.get(update.id).setDeleting();
        try {
          await this.#pointsModel.delete(updateType, update);
        } catch(err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
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
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
      case UpdateType.ERROR:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderFailedLoading();
        break;
    }
  };

  #renderLoading() {
    render(this.#loadingComponent, this.#container);
  }

  #renderFailedLoading() {
    render(this.#failedLoadingComponent, this.#container);
  }

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
    if (this.#isLoading) {
      this.#newPointButtonPresenter.disableButton();
      this.#renderLoading();
      return;
    }

    if(this.points.length === 0 && !this.#isCreating) {
      this.#newPointButtonPresenter.enableButton();
      this.#renderNoPoints();
      return;
    }

    this.#newPointButtonPresenter.enableButton();
    this.#renderSort();
    this.#renderPointContainer();
    this.#renderPoints();
  };

  init() {
    this.#renderBoard();
  }
}

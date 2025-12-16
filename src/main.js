import {render, RenderPosition} from './framework/render.js';
import InfoTrip from './view/info-trip-view.js';
import BoardPresenter from './presenter/board-presenter.js';
import MockService from './service/mock-service.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import PointsModel from './model/points-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import NewPointButtonPresenter from './presenter/new-point-button-presenter.js';
import FilterModel from './model/filter-model';

const filterElement = document.querySelector('.trip-controls__filters');
const pageMain = document.querySelector('.page-main');
const infoTripElement = document.querySelector('.trip-main');
const eventsListElement = pageMain.querySelector('.trip-events');
const filterModel = new FilterModel;
const mockService = new MockService();
const destinationsModel = new DestinationsModel(mockService);
const offersModel = new OffersModel(mockService);
const pointsModel = new PointsModel(mockService);

const newPointButtonPresenter = new NewPointButtonPresenter({
  container: infoTripElement,
});

const boardPresenter = new BoardPresenter({
  container: eventsListElement,
  destinationsModel,
  offersModel,
  pointsModel,
  filterModel,
  newPointButtonPresenter,
});

const filterPresenter = new FilterPresenter({
  container: filterElement,
  pointsModel,
  filterModel
});

render(new InfoTrip(), infoTripElement, RenderPosition.AFTERBEGIN);

newPointButtonPresenter.init({ onButtonClick: boardPresenter.newPointButtonClickHandler });

boardPresenter.init();
filterPresenter.init();

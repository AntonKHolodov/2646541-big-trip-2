import {render, RenderPosition} from './framework/render.js';
import TripInfoView from './view/trip-info-view.js';
import BoardPresenter from './presenter/board-presenter.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import PointsModel from './model/points-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import NewPointButtonPresenter from './presenter/new-point-button-presenter.js';
import FilterModel from './model/filter-model';
import PointsApiService from './service/points-api-service.js';

const AUTHORIZATION = 'Basic m4KsL1nQjW7eFpYd9XzRv3rnC';
const END_POINT = 'https://22.objects.htmlacademy.pro/big-trip';

const filterElement = document.querySelector('.trip-controls__filters');
const pageMain = document.querySelector('.page-main');
const tripInfoElement = document.querySelector('.trip-main');
const eventsListElement = pageMain.querySelector('.trip-events');
const filterModel = new FilterModel;

const pointsApiService = new PointsApiService(END_POINT, AUTHORIZATION);

const destinationsModel = new DestinationsModel(pointsApiService);
const offersModel = new OffersModel(pointsApiService);
const pointsModel = new PointsModel({
  service: pointsApiService,
  destinationsModel,
  offersModel
});

const newPointButtonPresenter = new NewPointButtonPresenter({
  container: tripInfoElement,
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

render(new TripInfoView(), tripInfoElement, RenderPosition.AFTERBEGIN);

newPointButtonPresenter.init({ onButtonClick: boardPresenter.newPointButtonClickHandler });

boardPresenter.init();
filterPresenter.init();
pointsModel.init();

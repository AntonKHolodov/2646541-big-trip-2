import FilterView from './view/filter-view.js';
import InfoTrip from './view/info-trip-view.js';
import BoardPresenter from './presenter/board-presenter.js';
import { RenderPosition, render } from './render.js';

const filterElement = document.querySelector('.trip-controls__filters');
const pageMain = document.querySelector('.page-main');
const infoTripElement = document.querySelector('.trip-main');
const eventsListElement = pageMain.querySelector('.trip-events');

const boardPresenter = new BoardPresenter({
  container: eventsListElement,
});

render(new InfoTrip(), infoTripElement, RenderPosition.AFTERBEGIN);
render(new FilterView(), filterElement);

boardPresenter.init();

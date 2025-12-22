import TripInfoView from '../view/trip-info-view.js';
import { render, replace, remove, RenderPosition } from '../framework/render.js';
import dayjs from 'dayjs';
import { UpdateType } from '../const.js';

const sortByDay = (a, b) => new Date(a.dateFrom) - new Date(b.dateFrom);

const formatWithDayjs = (date, format) => dayjs(date).format(format);

export default class TripInfoPresenter {
  #container = null;
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;

  #tripInfoComponent = null;

  constructor({ container, pointsModel, destinationsModel, offersModel }) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  init() {
    this.#render();
  }

  #handleModelEvent = (updateType) => {
    // For any change that can affect the header, rerender
    if (updateType === UpdateType.INIT || updateType === UpdateType.MAJOR || updateType === UpdateType.MINOR) {
      this.#render();
    }
  };

  #getRoutePoints(points) {
    const sorted = [...points].sort(sortByDay);

    return sorted.map((point) => {
      const destination = this.#destinationsModel.getById(point.destination);
      return { id: point.id, name: destination?.name };
    });
  }

  #getTotalCost(points) {
    return points.reduce((sum, point) => {
      const offersByType = this.#offersModel.getByType(point.type) ?? [];
      const offersPrice = (point.offers ?? [])
        .map((offerId) => offersByType.find((o) => o.id === offerId))
        .filter(Boolean)
        .reduce((s, o) => s + o.price, 0);

      return sum + Number(point.basePrice) + offersPrice;
    }, 0);
  }

  #render() {
    const points = this.#pointsModel.get();
    const sorted = [...points].sort(sortByDay);

    const data = {
      routePoints: this.#getRoutePoints(sorted),
      dateFrom: sorted[0]?.dateFrom ?? null,
      dateTo: sorted[sorted.length - 1]?.dateTo ?? null,
      totalCost: this.#getTotalCost(sorted),
    };

    const prev = this.#tripInfoComponent;
    this.#tripInfoComponent = new TripInfoView({ data, formatter: formatWithDayjs });

    if (prev === null) {
      render(this.#tripInfoComponent, this.#container, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#tripInfoComponent, prev);
    remove(prev);
  }

  destroy() {
    if (this.#tripInfoComponent) {
      remove(this.#tripInfoComponent);
      this.#tripInfoComponent = null;
    }
  }
}

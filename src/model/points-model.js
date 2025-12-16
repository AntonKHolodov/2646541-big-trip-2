import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';
import {updateItem, adaptToClient, adaptToServer} from '../utils/common.js';

export default class PointsModel extends Observable {
  #service = null;
  #points = [];
  #destinationsModel = null;
  #offersModel = null;

  constructor({service, destinationsModel, offersModel}) {
    super();
    this.#service = service;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  async init() {
    try {
      await Promise.all([
        this.#destinationsModel.init(),
        this.#offersModel.init()
      ]);
      const points = await this.#service.points;
      this.#points = points.map(adaptToClient);
      this._notify(UpdateType.INIT, {isError: false});
    } catch {
      this.#points = [];
      this._notify(UpdateType.ERROR, {isError: true});
    }
  }

  get() {
    return this.#points;
  }

  getById(id) {
    const foundPoints = this.#points.find((point) => point.id === id);
    return foundPoints || null;
  }

  async update(updateType, point) {
    try {
      const updatedPoint = await this.#service.updatePoint(adaptToServer(point));
      const adaptedPoint = adaptToClient(updatedPoint);
      this.#points = updateItem(this.#points, adaptedPoint);
      this._notify(updateType, adaptedPoint);
    } catch {
      throw new Error('Can\'t update point');
    }
  }

  async add(updateType, point) {
    try {
      const addedPoint = await this.#service.addPoint(adaptToServer(point));
      const adaptedPoint = adaptToClient(addedPoint);
      this.#points.push(adaptedPoint);
      this._notify(updateType, adaptedPoint);
    } catch {
      throw new Error('Can\'t add point');
    }
  }

  async delete(updateType, point) {
    try {
      await this.#service.deletePoint(point);
      this.#points = this.#points.filter((item) => item.id !== point.id);
      this._notify(updateType);
    } catch {
      throw new Error('Can\'t delete point');
    }
  }
}

export default class DestinationsModel {
  #service = null;
  #destinations = [];

  constructor(service) {
    this.#service = service;
  }

  get() {
    return this.#destinations;
  }

  getById(id) {
    const foundDestination = this.#destinations.find((destination) => destination.id === id);
    return foundDestination || null;
  }

  async init() {
    this.#destinations = await this.#service.destinations;
    return this.#destinations;
  }
}

export default class OffersModel {
  #service = null;
  #offers = [];

  constructor(service) {
    this.#service = service;
  }

  async init() {
    this.#offers = await this.#service.offers;
    return this.#offers;
  }

  get() {
    return this.#offers;
  }

  getByType(type) {
    const foundOffers = this.#offers.find((offer) => offer.type.toLowerCase() === type.toLowerCase()).offers;
    return foundOffers || null;
  }
}

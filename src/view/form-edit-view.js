import AbstractView from '../framework/view/abstract-view.js';
import { formatStringToDayTime } from '../utils/day.js';
import { POINT_BLANCK, TYPES } from '../const.js';

function createFormEditTemplate({ point, pointDestinations, pointOffers }) {
  const { type, dateFrom, dateTo, basePrice } = point;
  const { name, description, pictures } = pointDestinations;

  return `
        <li class="trip-events__item">
            <form class="event event--edit" action="#" method="post">
            <header class="event__header">
                <div class="event__type-wrapper">
                <label class="event__type  event__type-btn" for="event-type-toggle-1">
                    <span class="visually-hidden">Choose event type</span>
                    <img class="event__type-icon" width="17" height="17" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
                </label>
                <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

                <div class="event__type-list">
                    <fieldset class="event__type-group">
                    <legend class="visually-hidden">Event type</legend>
                    ${TYPES.map((eventType) => `
                    <div class="event__type-item">
                        <input id="event-type-${eventType.toLowerCase()}-1" class="event__type-input visually-hidden" type="radio" name="event-type" value="${eventType.toLowerCase()}" ${type.toLowerCase() === eventType.toLowerCase() ? 'checked' : ''}>
                        <label class="event__type-label event__type-label--${eventType.toLowerCase()}" for="event-type-${eventType.toLowerCase()}-1">${eventType}</label>
                    </div>
                    `).join('')}
                    </fieldset>
                </div>
                </div>

                <div class="event__field-group  event__field-group--destination">
                <label class="event__label  event__type-output" for="event-destination-1">
                    ${type}
                </label>
                <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${name}" list="destination-list-1">
                <datalist id="destination-list-1">
                    <option value="Amsterdam"></option>
                    <option value="Geneva"></option>
                    <option value="Chamonix"></option>
                </datalist>
                </div>

                <div class="event__field-group  event__field-group--time">
                <label class="visually-hidden" for="event-start-time-1">From</label>
                <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formatStringToDayTime(dateFrom)}">&mdash;
                <label class="visually-hidden" for="event-end-time-1">To</label>
                <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time"  value="${formatStringToDayTime(dateTo)}">
                </div>

                <div class="event__field-group  event__field-group--price">
                <label class="event__label" for="event-price-1">
                    <span class="visually-hidden">Price</span>
                    &euro;
                </label>
                <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
                </div>

                <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                <button class="event__reset-btn" type="reset">Cancel</button>
                <button class="event__rollup-btn" type="button">
                  <span class="visually-hidden">Open event</span>
                </button>
            </header>
            <section class="event__details">
                <section class="event__section  event__section--offers">
                <h3 class="event__section-title  event__section-title--offers">Offers</h3>

                <div class="event__available-offers">
                ${pointOffers.map((offer) => `
                <div class="event__offer-selector">
                    <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-1" type="checkbox" name="event-offer-luggage" checked>
                    <label class="event__offer-label" for="event-offer-luggage-1">
                    <span class="event__offer-title">${offer.title}</span>
                    &plus;&euro;&nbsp;
                    <span class="event__offer-price">${offer.price}</span>
                    </label>
                </div>`).join('')}
                <div class="event__available-offers">
                </div>
                </section>

                <section class="event__section  event__section--destination">
                <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                <p class="event__destination-description">${name} ${description}</p>

                <div class="event__photos-container">
                ${pictures.map((picture) => `
                    <div class="event__photos-tape">
                    <img class="event__photo" src="${picture.src}" alt="${picture.description}">
                    </div>`).join('')}
                </div>
                </section>
            </section>
            </form>
        </li>
    `;
}

export default class FormEditView extends AbstractView {
  #point = null;
  #pointDestinations = null;
  #pointOffers = null;
  #onResetClick = null;
  #onSubmitClick = null;

  constructor({ point = POINT_BLANCK, pointDestinations, pointOffers, onSubmitClick , onResetClick }) {
    super();
    this.#point = point;
    this.#pointDestinations = pointDestinations;
    this.#pointOffers = pointOffers;
    this.#onResetClick = onResetClick;
    this.#onSubmitClick = onSubmitClick;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#resetButtonClickHandler);
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
  }

  get template() {
    return createFormEditTemplate({
      point: this.#point,
      pointDestinations: this.#pointDestinations,
      pointOffers: this.#pointOffers,
    });
  }

  #resetButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#onResetClick();
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#onSubmitClick();
  };
}

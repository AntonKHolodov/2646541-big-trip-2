import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { formatStringToDayTime } from '../utils/day.js';
import { TYPES, EditType, Mode } from '../const.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { toCapitalize } from '../utils/common.js';
import he from 'he';

const POINT_BLANK = {
  basePrice: '0',
  dateFrom: null,
  dateTo: null,
  destination: '',
  isFavorite: false,
  offers: [],
  type: 'flight',
};

const createTypeTemplate = (currentType) => `
  ${TYPES.map((eventType) => `
    <div class="event__type-item">
      <input id="event-type-${eventType.toLowerCase()}-1" class="event__type-input visually-hidden" type="radio" name="event-type" value="${eventType.toLowerCase()}" ${currentType.toLowerCase() === eventType.toLowerCase() ? 'checked' : ''}>
      <label class="event__type-label event__type-label--${eventType.toLowerCase()}" for="event-type-${eventType.toLowerCase()}-1">${eventType}</label>
    </div>
  `).join('')}
`;

const createTypeWrapperTemplate = (type, isDisabled) => `
  <div class="event__type-wrapper">
    <label class="event__type  event__type-btn" for="event-type-toggle-1">
      <span class="visually-hidden">Choose event type</span>
      <img class="event__type-icon" width="17" height="17" src="img/icons/${type.toLowerCase()}.png" alt="Event ${type.toLowerCase()} icon">
    </label>
    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>
    <div class="event__type-list">
      <fieldset class="event__type-group">
        <legend class="visually-hidden">Event type</legend>
        ${createTypeTemplate(toCapitalize(type))}
      </fieldset>
    </div>
  </div>
`;

const createDateTemplate = (dateFrom, dateTo, isDisabled) => (`
    <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-1">From</label>
      <input class="event__input  event__input--time" required id="event-start-time-1" type="text" name="event-start-time" ${isDisabled ? 'disabled' : ''} value="${formatStringToDayTime(dateFrom)}">
      &mdash;
      <label class="visually-hidden" for="event-end-time-1">To</label>
      <input class="event__input  event__input--time" required id="event-end-time-1" type="text" name="event-end-time"  ${isDisabled ? 'disabled' : ''} value="${formatStringToDayTime(dateTo)}">
    </div>`);

const createCitiesTemplate = (pointDestinations) => {
  const cityDestinations = Array.from(new Set(pointDestinations.map((item) => item.name)));
  return (`${cityDestinations.map((city) => `<option value="${city}">${city}</option>`).join('')}`);
};

const createPriceTemplate = (basePrice, isDisabled) => (`
  <div class="event__field-group  event__field-group--price">
    <label class="event__label" for="event-price-1">
        <span class="visually-hidden">Price</span>
        &euro;
    </label>
    <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${he.encode(String(basePrice))}" min="1" max="100000" required ${isDisabled ? 'disabled' : ''}>
  </div>`);

const createOffersTemplate = (hasOffers, offersByType, offers) => (`
  ${hasOffers ? `
  <section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

    <div class="event__available-offers">
    ${offersByType.map((offer) => {
    const checked = offers.includes(offer.id) ? 'checked' : '';
    return `
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}" type="checkbox" name="event-offer-${offer.id}" data-offer-id=${offer.id} ${checked}>
        <label class="event__offer-label" for="event-offer-${offer.id}">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>`;
  }).join('')}
    </div>
  </section>` : ''}
  `);

const createPicturesTemplate = (pictures) => (
  `${(pictures) ?
    `<div class="event__photos-tape">
    ${(pictures).map((picture) =>
    `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`
  ).join('')}
      </div>`
    : ''}`
);

const createDestinationsTemplate = (hasDestinations, destinationById, hasPictures) => (`
    ${hasDestinations ? `
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${destinationById.description}</p>
      ${hasPictures ? `
        <div class="event__photos-container">
          ${createPicturesTemplate(destinationById.pictures)}
        </div>
      ` : ''}
    </section>
    ` : ''}
  `
);

const createButtonTemplate = (isCreating, isDeleting, isDisabled) => {
  if (isCreating) {
    return `
      <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>Cancel</button>
    `;
  }
  return `
    <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${isDeleting ? 'Deleting' : 'Delete'}</button>
    <button class="event__rollup-btn" type="button" ${isDisabled ? 'disabled' : ''}><span class="visually-hidden">Open event</span></button>
    `;
};


const createFormEditTemplate = ({ state, pointDestinations, pointOffers, modeAddForm }) => {
  const { point } = state;
  const { type, dateFrom, dateTo, basePrice, destination, offers } = point;
  const {
    isDisabled,
    isSaving,
    isDeleting,
  } = state;
  const isCreating = modeAddForm === EditType.CREATING;
  const offersByType = pointOffers.find((item) => item.type.toLowerCase() === point.type.toLowerCase()).offers;
  const destinationById = pointDestinations.find((item) => item.id === destination);
  const hasOffers = offersByType.length > 0;
  const hasDestinations = destinationById?.pictures.length > 0 || destinationById?.description;
  const hasPictures = destinationById?.pictures.length > 0;
  return `
        <li class="trip-events__item">
            <form class="event event--edit" action="#" method="post">
            <header class="event__header">
                ${createTypeWrapperTemplate(type, isDisabled)}
                <div class="event__field-group  event__field-group--destination">
                  <label class="event__label  event__type-output" for="event-destination-1">
                    ${type}
                  </label>
                  <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinationById ? he.encode(destinationById.name) : ''}" list="destination-list-1" 
                  required ${isDisabled ? 'disabled' : ''}>
                  <datalist id="destination-list-1">
                  ${createCitiesTemplate(pointDestinations, destinationById)}
                  </datalist>
                </div>
                ${createDateTemplate(dateFrom, dateTo, isDisabled, isCreating)}
                ${createPriceTemplate(basePrice, isDisabled)}

                <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
                ${createButtonTemplate(isCreating, isDeleting, isDisabled)}
            </header>
            <section class="event__details">
              ${createOffersTemplate(hasOffers,offersByType, offers)}
              ${createDestinationsTemplate(hasDestinations, destinationById, hasPictures)}
            </section>
            </form>
        </li>
    `;
};

export default class FormEditView extends AbstractStatefulView {
  #pointDestinations = null;
  #pointOffers = null;
  #onResetClick = null;
  #onSubmitClick = null;
  #datepickerFrom = null;
  #datepickerTo = null;
  #onDeleteClick = null;
  #modeAddForm = EditType.EDITING;

  constructor({ point = POINT_BLANK, pointDestinations, pointOffers, onSubmitClick , onResetClick, onDeleteClick, modeAddForm = Mode.EDITING }) {
    super();
    this._state = point;
    this._setState(FormEditView.parsePointToState({point}));
    this.#pointDestinations = pointDestinations;
    this.#pointOffers = pointOffers;
    this.#onResetClick = onResetClick;
    this.#onSubmitClick = onSubmitClick;
    this.#onDeleteClick = onDeleteClick;
    this.#modeAddForm = modeAddForm;
    this._restoreHandlers();
  }

  get template() {
    return createFormEditTemplate({
      state: this._state,
      pointDestinations: this.#pointDestinations,
      pointOffers: this.#pointOffers,
      modeAddForm: this.#modeAddForm
    });
  }

  reset = (point) => this.updateElement({point});

  removeElement = () => {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }

    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  };

  _restoreHandlers = () => {
    if(this.#modeAddForm === EditType.EDITING) {
      this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#resetButtonClickHandler);
      this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formDeleteHandler);
    }
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__available-offers')?.addEventListener('change', this.#offerChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#priceChangeHandler);
    if(this.#modeAddForm === EditType.CREATING) {
      this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formDeleteHandler);
    }
    this.#setDatepickers();
  };

  #resetButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#onResetClick();
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#onSubmitClick(FormEditView.parseStateToPoint(this._state));
  };

  #typeChangeHandler = (evt) => {
    this.updateElement({
      point: {
        ...this._state.point,
        type: evt.target.value,
        offers: []
      }
    });
  };

  #priceChangeHandler = (evt) => {
    this._setState({
      point: {
        ...this._state.point,
        basePrice: evt.target.valueAsNumber
      }
    });
    this.element.querySelector('.event__save-btn').disabled = false;
  };

  #destinationChangeHandler = (evt) => {
    if (evt.target.value) {
      const selectedDestination = this.#pointDestinations.find((pointDestination) => pointDestination.name === toCapitalize(evt.target.value));
      const selectedDestinationId = (selectedDestination) ? selectedDestination.id : this._state.point.destination;
      this.updateElement({
        point: {
          ...this._state.point,
          destination: selectedDestinationId
        }
      });
    }
  };

  #offerChangeHandler = () => {
    const checkedBoxes = Array.from(this.element.querySelectorAll('.event__offer-checkbox:checked'));

    this._setState({
      point: {
        ...this._state.point,
        offers: checkedBoxes.map((element) => element.dataset.offerId)
      }
    });
  };

  #dateFromCloseHandler = ([userDate]) => {
    this._setState({
      point: {
        ...this._state.point,
        dateFrom: userDate,
      }
    });
    this.#datepickerTo.set('minDate', this._state.point.dateFrom);
  };

  #dateToCloseHandler = ([userDate]) => {
    this._setState({
      point: {
        ...this._state.point,
        dateTo: userDate,
      }
    });
    this.#datepickerFrom.set('maxDate', this._state.point.dateTo);
  };

  #setDatepickers = () => {
    const [dateFromElement, dateToElement] = this.element.querySelectorAll('.event__input--time');
    const config = {
      dateFormat: 'd/m/y H:i',
      enableTime: true,
      locale: {
        firstDayOfWeek: 1,
      },
      'time_24hr': true,
      allowInput: true
    };

    this.#datepickerFrom = flatpickr(
      dateFromElement,
      {
        ...config,
        defaultDate: this._state.point.dateFrom,
        onClose: this.#dateFromCloseHandler,
        maxDate: this._state.point.dateTo,
      }
    );

    this.#datepickerTo = flatpickr(
      dateToElement,
      {
        ...config,
        defaultDate: this._state.point.dateTo,
        onClose: this.#dateToCloseHandler,
        minDate: this._state.point.dateFrom,
      }
    );
  };

  #formDeleteHandler = (evt) => {
    evt.preventDefault();
    this.#onDeleteClick(FormEditView.parseStateToPoint(this._state));
  };

  static parsePointToState = ({
    point,
    isDisabled = false,
    isSaving = false,
    isDeleting = false,
  }) => ({
    point,
    isDisabled,
    isSaving,
    isDeleting,});

  static parseStateToPoint = (state) => state.point;
}

import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import dayjs from 'dayjs';

const createEditingFormTemplate = (trip, destinations, offersByType) => {
  const { destination, type, offers } = trip;

  const destinationDetails = destinations.find((dest) => dest.id === destination) || {};

  const photoHTML = (destinationDetails.pictures || []).map((pic) => `
    <img class="event__photo" src="${pic.src}" alt="${pic.description}">
  `).join('');

  const destinationsHTML = destinations.map((dest) => `
    <option value="${dest.name}" "${destinationDetails.name === dest.name ? 'selected' : ''}"></option>
  `).join('');

  const relevantOffers = offersByType.find((option) => option.type === type)?.offers || [];

  const eventOffersHTML = relevantOffers.map((offer, index) => `
    <div class="event__offer-selector">
      <input class="event__offer-checkbox visually-hidden" id="event-offer-${type}-${index + 1}" type="checkbox" name="event-offer-${type}" ${offers.includes(offer.id) ? 'checked' : ''}>
      <label class="event__offer-label" for="event-offer-${type}-${index + 1}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>
  `).join('');

  const checkedTypeHTML = offersByType.map((typeOfOption, index) => `
  <div class="event__type-item">
   <input id="event-type-${typeOfOption.type}-${index + 1}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${typeOfOption.type}" ${type.includes(typeOfOption.type) ? 'checked' : ''}>
    <label class="event__type-label  event__type-label--${typeOfOption.type}" for="event-type-${typeOfOption.type}-${index + 1}">${typeOfOption.type.charAt(0).toUpperCase() + typeOfOption.type.slice(1)}</label>
  </div>
  `).join('');

  return (`
  <li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${checkedTypeHTML}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinationDetails.name}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${destinationsHTML}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dayjs('2019-03-19').format('DD/MM/YY HH:mm')}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dayjs('2019-03-19').format('DD/MM/YY HH:mm')}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="">
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
          ${eventOffersHTML}
          </div>
        </section>

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${destinationDetails.description}.</p>

          <div class="event__photos-container">
            <div class="event__photos-tape">
              ${photoHTML}
            </div>
          </div>
        </section>
      </section>
    </form>
    </li>`
  );
};

export default class EditingFormView extends AbstractStatefulView {
  #trip = null;
  #destinations = null;
  #offers = null;
  #handleFormSubmit = null;
  #handleFormreset = null;

  constructor({trip, destinations, offers, onFormSubmit, onFormReset}) {
    super();
    this.#trip = trip;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleFormreset = onFormReset;

    this.element.querySelector('.event--edit')
      .addEventListener('submit', this.#handleFormSubmit);
    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#handleFormreset);
    this.element.querySelector('.event__reset-btn')
      .addEventListener('click', this.#handleFormreset);
  }

  get template() {
    return createEditingFormTemplate(this.#trip, this.#destinations, this.#offers);
  }

  removeElement() {
    super.removeElement();
    this.element.querySelector('.event--edit')
      .removeEventListener('click', this.#onSubmitForm);
    this.element.querySelector('.event__rollup-btn')
      .removeEventListener('click', this.#onResetForm);
    this.element.querySelector('.event__reset-btn')
      .removeEventListener('click', this.#onResetForm);
  }

  #onSubmitForm = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit();
  };

  #onResetForm = (evt) => {
    evt.preventDefault();
    this.#handleFormreset();
  };

}


import AbstractView from '../framework/view/abstract-view.js';
import { getDifferenceDate } from '../utils.js';
import dayjs from 'dayjs';


const createWaypointTemplate = (trip, destinations, offersByType) => {
  const { basePrice, dateFrom, dateTo, destination, isFavorite, offers, type } = trip;

  const selectedOffers = (offersByType || []).flatMap((option) => option.offers)
    .filter((offer) => offers.includes(offer.id));

  const desiredDestination = destinations.find((dest) => dest.id === destination);

  const dateFromDayjs = dayjs(dateFrom);
  const dateToDayjs = dayjs(dateTo);

  const offersHTML = selectedOffers.map((offer) => `
  <li class="event__offer">
    <span class="event__offer-title">${offer.title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${offer.price}</span>
  </li>
  `).join('');

  const totalPrice = selectedOffers.reduce((price, offer) => price + offer.price, 0);

  return(`
  <li class="trip-events__item">
  <div class="event">
    <time class="event__date" datetime="${dateFromDayjs.format('YYYY-MM-DD')}">${dateFromDayjs.format('MMM DD')}</time>
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${type.charAt(0).toUpperCase() + type.slice(1)} ${desiredDestination.name}</h3>
    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="${dateFromDayjs.format('YYYY-MM-DDTHH:mm')}">${dateFromDayjs.format('HH:mm')}</time>
        &mdash;
        <time class="event__end-time" datetime="${dateToDayjs.format('YYYY-MM-DDTHH:mm')}">${dateToDayjs.format('HH:mm')}</time>
      </p>
      <p class="event__duration">${getDifferenceDate(dateFromDayjs, dateToDayjs)}</p>
    </div>
    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${basePrice + totalPrice}</span>
    </p>
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">${offersHTML}</ul>
    <button class="event__favorite-btn ${isFavorite ? 'event__favorite-btn--active' : ''}" type="button">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>
  </li>`
  );
};


export default class WaypointView extends AbstractView {
  #trip = null;
  #destinations = null;
  #offers = null;
  #handleFormReset = null;
  #handleFavoritePoint = null;

  constructor({trip, destinations, offers, onEditClick, onFavoriteButton}) {
    super();
    this.#trip = trip;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleFormReset = onEditClick;
    this.#handleFavoritePoint = onFavoriteButton;

    this.#onFavoriteButtonClick = this.#onFavoriteButtonClick.bind(this);
    this.#onRollupClick = this.#onRollupClick.bind(this);
  }

  get template () {
    return createWaypointTemplate(this.#trip, this.#destinations, this.#offers);
  }

  setEventListeners() {
    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#onRollupClick);
    this.element.querySelector('.event__favorite-btn')
      .addEventListener('click', this.#onFavoriteButtonClick);
  }

  removeElement() {
    this.element.querySelector('.event__rollup-btn')
      .removeEventListener('click', this.#onRollupClick);
    this.element.querySelector('.event__rollup-btn')
      .removeEventListener('click', this.#onFavoriteButtonClick);
    super.removeElement();
  }

  #onRollupClick = (evt) => {
    evt.preventDefault();
    this.#handleFormReset();
  };

  #onFavoriteButtonClick = (evt) => {
    evt.preventDefault(); // не нужно сбрасывать поведение по-умолчанию?
    this.#handleFavoritePoint();
  };
}

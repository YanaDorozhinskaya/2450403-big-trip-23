import AbstractView from '../framework/view/abstract-view.js';
import { render, replace } from '../framework/render.js';
import { isEscapeKey } from '../utils.js';
import WaypointView from '../view/waypoint-view.js';
import EditingFormView from '../view/editing-form-view.js';
import { Mode } from '../const.js';

export default class WaypointPresenter extends AbstractView {
  #container = null;
  #trip = null;
  #destinations = null;
  #offersByType = null;
  #waypointComponent = null;
  #editingFormComponent = null;
  #handleDataChange = null;
  #onEditStart = null;
  #mode = Mode.DEFAULT;

  constructor ({container, trip, destinations, offersByType, onPointUpdate, onEditStart}) {
    super();
    this.#container = container;
    this.#trip = trip;
    this.#destinations = destinations;
    this.#offersByType = offersByType;
    this.#handleDataChange = onPointUpdate;
    this.#onEditStart = onEditStart;
  }

  init(trip) {
    this.#trip = trip;
    this.#waypointComponent = new WaypointView({
      trip: this.#trip,
      destinations: this.#destinations,
      offers: this.#offersByType,
      onEditClick: this.#onEditClick,
      onFavoriteButton: this.#onFavoriteButton
    });

    this.#editingFormComponent = new EditingFormView({
      trip: this.#trip,
      destinations: this.#destinations,
      offers: this.#offersByType,
      onFormSubmit: this.#onFormSubmit,
      onFormReset: this.#onFormReset,
    });

    render(this.#waypointComponent, this.#container);
  }

  resetEditForm() {
    if (this.#mode === Mode.EDIT) {
      this.#switchToViewMode();
    }
  }

  #onEscapePress = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.#switchToViewMode();
    }
  };

  #onEditClick = () => {
    this.#switchToEditMode();
    this.#onEditStart(this);
  };

  #onFormSubmit = (updatedTrip) => {
    this.#trip = updatedTrip;
    this.#handleDataChange(updatedTrip);
    this.#switchToViewMode();
  };

  #onFormReset = () => this.#switchToViewMode();
  #onFavoriteButton = () => {
    this.#trip.isFavorite = !this.#trip.isFavorite;
    this.#handleDataChange(this.#trip);
    this.#switchToFavoriteAndBack();
  };

  #switchToEditMode() {
    replace(this.#editingFormComponent, this.#waypointComponent);
    document.addEventListener('keydown', this.#onEscapePress);
    this.#mode = Mode.EDIT;
  }

  #switchToViewMode(){
    replace(this.#waypointComponent, this.#editingFormComponent);
    document.removeEventListener('keydown', this.#onEscapePress);
    this.#mode = Mode.DEFAULT;
  }

  #switchToFavoriteAndBack = () => {
    this.#waypointComponent.updateFavorite(this.#trip.isFavorite);
  };
}


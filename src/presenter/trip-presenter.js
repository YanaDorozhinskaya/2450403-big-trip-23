import SortingView from '../view/sorting-view.js';
import WaypointsListView from '../view/waypoints-list-view.js';
import { render } from '../framework/render.js';
import WaypointPresenter from './waypoint-presenter.js';
import { updateData } from '../utils.js';

export default class TripPresenter extends AbortController {
  #container = null;
  #tripModel = null;
  #trips = [];
  #destinations = [];
  #offersByType = [];
  #waypointPresenters = new Map();

  constructor({ container, tripModel }) {
    super();
    this.#container = container;
    this.#tripModel = tripModel;
  }

  init() {
    this.#trips = this.#tripModel.getTrips();
    this.#destinations = this.#tripModel.getDestinations();
    this.#offersByType = this.#tripModel.getOffers();

    this.#renderTrip();
  }

  #renderTrip() {

    const waypointsListView = new WaypointsListView();

    render(waypointsListView, this.#container);
    render(new SortingView(), this.#container);

    this.#trips.forEach((trip) => this.#renderWaypoint(waypointsListView, trip));
  }

  #renderWaypoint(waypointsListView, trip) {
    const waypointPresenter = new WaypointPresenter({
      container: waypointsListView.element,
      trip: trip,
      destinations: this.#destinations,
      offers: this.#offersByType,
      onPointUpdate: this.#handleDataChange,
      onEditStart: this.#handleWaypointEdit
    });

    waypointPresenter.init(trip);
    this.#waypointPresenters.set(trip.id, waypointPresenter);
  }

  #handleDataChange(updatedItem) {
    this.#trips = updateData(this.#trips, updatedItem);
    this.#waypointPresenters.get(updatedItem.id).init(updatedItem);
  }

  #handleWaypointEdit = () => {
    this.#waypointPresenters.forEach((presenter) => presenter.resetAll());
  };
}

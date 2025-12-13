import SortView from '../view/sort-view.js';
import EditList from '../view/event-list-view.js';
import FormEditView from '../view/form-edit-view.js';
import PointView from '../view/point-view.js';
import { render } from '../render.js';

export default class BoardPresenter {
  sortComponent = new SortView();
  editListComponent = new EditList();

  constructor({ container, destinationsModel, offersModel, pointsModel }) {
    this.container = container;
    this.destinations = destinationsModel;
    this.offers = offersModel;
    this.points = pointsModel.get();
  }

  init() {
    render(this.sortComponent, this.container);
    render(this.editListComponent, this.container);
    render(new FormEditView ({
      point: this.points[0],
      pointDestinations: this.destinations.getById(this.points[0].destination),
      pointOffers: this.offers.getByType(this.points[0].type)
    }), this.editListComponent.getElement()
    );

    this.points.forEach((point) => {
      render(
        new PointView({
          point,
          pointDestinations: this.destinations.getById(point.destination),
          pointOffers: this.offers.getByType(point.type)
        }),
        this.editListComponent.getElement()
      );
    });
  }
}


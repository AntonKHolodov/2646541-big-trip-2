import SortView from '../view/sort-view.js';
import EditList from '../view/event-list-view.js';
import FormEditView from '../view/form-edit-view.js';
import PointView from '../view/point-view.js';
import { render } from '../render.js';

export default class BoardPresenter {
  sortComponent = new SortView();
  editListComponent = new EditList();

  constructor({ container }) {
    this.container = container;
  }

  init() {
    render(this.sortComponent, this.container);
    render(this.editListComponent, this.container);
    render(new FormEditView(), this.editListComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render(new PointView(), this.editListComponent.getElement());
    }
  }
}

import { createElement } from '../render.js';

function createEditListTemplate() {
  return `
        <ul class="trip-events__list"></ul>
    `;
}

export default class EditList {
  getTemplate() {
    return createEditListTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}


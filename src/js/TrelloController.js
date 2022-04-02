export default class TrelloController {
  constructor(container, object) {
    this.container = container;
    this.object = object;
  }

  drowUI() {
    this.object.drowTrello();
  }

  checkLists() {
    this.object.checkTaskLists();
  }

  control() {
    this.trelloBox = this.container.querySelector('.trello-box');

    const trelloBoxListener1 = (event) => {
      this.target = event.target;

      if (this.target.closest('.list-box-adding-container')) {
        event.preventDefault();
        this.object.addingForm(this.target);
      }

      if (this.target.classList.contains('add-form-button-add')) {
        event.preventDefault();
        this.object.addingCard(this.target);
      }

      if (this.target.classList.contains('add-form-button-cancel')) {
        event.preventDefault();
        this.object.removeAddForm(this.target);
      }

      if (this.target.classList.contains('card-close')) {
        event.preventDefault();
        this.object.removeCard(this.target);
      }
    };

    const trelloBoxListener2 = (event) => {
      this.target = event.target;

      if (this.target.closest('.data-item')) {
        event.preventDefault();
        this.object.getCardRemover(this.target);
      }
    };

    const trelloBoxListener3 = (event) => {
      this.target = event.target;

      if (this.target.closest('.data-item')) {
        event.preventDefault();
        this.object.removeCardRemover(this.target);
      }
    };

    const trelloBoxListener4 = (event) => {
      this.target = event.target;

      if (this.target.closest('.add-form-input')) {
        event.preventDefault();
        this.object.removeValidationAddFormInput();
      }

      if (this.target.closest('.add-form-text')) {
        event.preventDefault();
        this.object.removeValidationAddFormText();
      }
    };

    const trelloBoxListener5 = (event) => {
      this.event = event;
      this.target = event.target;

      if (this.target.closest('.data-item') && !this.target.classList.contains('card-close')) {
        event.preventDefault();
        this.object.startDrag(this.event);
      }
    };

    const trelloBoxListener6 = (event) => {
      this.event = event;

      if (this.object.ghostCard) {
        event.preventDefault();
        this.object.moveAt(this.event);
      }
    };

    const trelloBoxListener7 = (event) => {
      this.event = event;

      if (this.object.ghostCard) {
        event.preventDefault();
        this.object.removeAt();
      }
    };

    const trelloBoxListener8 = (event) => {
      this.event = event;
      this.target = event.target;

      if (this.object.ghostCard) {
        event.preventDefault();
        this.object.finishDrag(this.event);
      }
    };

    const trelloBoxListener9 = (event) => {
      this.event = event;
      this.target = event.target;
      if (this.target.closest('.add-form-input')) {
        if (this.event.key === 'Enter') {
          this.event.preventDefault();
        }
      }
    };

    const loadListener1 = () => {
      this.object.loadState();
    };

    const unloadListener1 = () => {
      this.object.saveState();
    };

    this.trelloBox.addEventListener('click', trelloBoxListener1);
    this.trelloBox.addEventListener('mouseover', trelloBoxListener2);
    this.trelloBox.addEventListener('mouseout', trelloBoxListener3);
    this.trelloBox.addEventListener('keyup', trelloBoxListener4);
    this.trelloBox.addEventListener('mousedown', trelloBoxListener5);
    this.trelloBox.addEventListener('mousemove', trelloBoxListener6);
    this.trelloBox.addEventListener('mouseleave', trelloBoxListener7);
    this.trelloBox.addEventListener('mouseup', trelloBoxListener8);
    this.trelloBox.addEventListener('keydown', trelloBoxListener9);

    window.addEventListener('load', loadListener1);
    window.addEventListener('unload', unloadListener1);
  }
}

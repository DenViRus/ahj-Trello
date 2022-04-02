import Card from './Card.js';

export default class TrelloUI {
  constructor(container, stateService) {
    this.container = container;
    this.stateService = stateService;
    this.columns = ['todo', 'in progress', 'done'];
    this.allTaskHeaders = null;
    this.allTasks = null;
    this.data = null;
    this.dropItems = null;
    this.noDropItems = null;
    this.draggedCard = null;
    this.draggedCardList = null;
    this.draggedCards = null;
    this.ghostCard = null;
    this.droppedCardList = null;
    this.droppedCards = null;
    this.closest = null;
  }

  drowTrello() {
    const trelloBox = document.createElement('div');
    trelloBox.className = 'trello-box';
    trelloBox.setAttribute('id', 'trelloBox');
    for (let i = 0, len = this.columns.length; i < len; i++) {
      const listBox = document.createElement('div');
      listBox.className = `list-box list-box-${this.columns[i].replace(/ +/g, '')}`;
      listBox.setAttribute('id', `listBox${this.columns[i].replace(/ +/g, '').replace(/^[a-z]/, (u) => u.toUpperCase())}`);
      const listBoxHeadingContainer = document.createElement('div');
      listBoxHeadingContainer.className = 'list-box-heading-container';
      const listBoxListContainer = document.createElement('div');
      listBoxListContainer.className = 'list-box-list-container';
      const listBoxAddingContainer = document.createElement('div');
      listBoxAddingContainer.className = 'list-box-adding-container';
      const listBoxHeading = document.createElement('h3');
      listBoxHeading.className = 'list-box-heading';
      listBoxHeading.textContent = `${this.columns[i].toUpperCase()}`;
      const listBoxList = document.createElement('ul');
      listBoxList.className = `list-box-list list-box-list-${this.columns[i].replace(/ +/g, '')}`;
      listBoxList.setAttribute('id', `listBoxList${this.columns[i].replace(/ +/g, '').replace(/^[a-z]/, (u) => u.toUpperCase())}`);
      const listBoxAddingSign = document.createElement('span');
      listBoxAddingSign.className = 'list-box-adding-sign';
      listBoxAddingSign.textContent = '+';
      const listBoxAddingText = document.createElement('span');
      listBoxAddingText.className = 'list-box-adding-text';
      listBoxAddingText.textContent = 'Add another card';
      listBoxHeadingContainer.append(listBoxHeading);
      listBoxListContainer.append(listBoxList);
      listBoxAddingContainer.append(listBoxAddingSign);
      listBoxAddingContainer.append(listBoxAddingText);
      listBox.append(listBoxHeadingContainer);
      listBox.append(listBoxListContainer);
      listBox.append(listBoxAddingContainer);
      trelloBox.append(listBox);
    }
    this.container.append(trelloBox);
    this.trelloBox = this.container.querySelector('.trello-box');
  }

  static createEmptyCard() {
    const emptyItem = document.createElement('li');
    emptyItem.className = 'item empty-item';
    emptyItem.textContent = 'No cards here';
    return emptyItem;
  }

  checkTaskLists() {
    const cardLists = [...this.trelloBox.querySelectorAll('.list-box-list')];
    for (const cardList of cardLists) {
      const emptycards = cardList.querySelectorAll('.empty-item');
      const dataCards = cardList.querySelectorAll('.data-item');
      if (emptycards.length === 0 && dataCards.length === 0) {
        const emptyCard = TrelloUI.createEmptyCard();
        cardList.append(emptyCard);
      }
      if (emptycards.length > 0 && dataCards.length > 0) {
        const emptyCard = cardList.querySelector('.empty-item');
        emptyCard.remove();
      }
    }
  }

  static createAddForm() {
    const addFormContainer = document.createElement('div');
    addFormContainer.className = 'add-form-container';
    const addForm = document.createElement('form');
    addForm.className = 'add-form';
    const label = document.createElement('label');
    label.className = 'add-form-label';
    const addFormInputContainer = document.createElement('div');
    addFormInputContainer.className = 'form-input-container add-form-input-container';
    const addFormTextContainer = document.createElement('div');
    addFormTextContainer.className = 'form-input-container add-form-text-container';
    const addFormButtonContainer = document.createElement('div');
    addFormButtonContainer.className = 'add-form-button-container';
    const addFormInput = document.createElement('input');
    addFormInput.className = 'form-input add-form-input';
    addFormInput.setAttribute('type', 'text');
    addFormInput.setAttribute('autocomplete', 'off');
    addFormInput.setAttribute('placeholder', 'enter card name');
    addFormInput.setAttribute('maxLength', '25');
    const addFormText = document.createElement('textarea');
    addFormText.className = 'form-input add-form-text';
    addFormText.setAttribute('autocomplete', 'off');
    addFormText.setAttribute('placeholder', 'enter description');
    addFormText.setAttribute('rows', '4');
    addFormText.setAttribute('maxLength', '125');
    const addFormButtonAdd = document.createElement('button');
    addFormButtonAdd.className = 'add-form-button add-form-button-add';
    addFormButtonAdd.setAttribute('type', 'submit');
    addFormButtonAdd.textContent = 'Add Card';
    const addFormButtonCansel = document.createElement('button');
    addFormButtonCansel.className = 'add-form-button add-form-button-cancel';
    addFormButtonCansel.setAttribute('type', 'reset');
    addFormButtonCansel.textContent = 'Cancel';
    addFormInputContainer.append(addFormInput);
    addFormTextContainer.append(addFormText);
    addFormButtonContainer.append(addFormButtonAdd);
    addFormButtonContainer.append(addFormButtonCansel);
    label.append(addFormInputContainer);
    label.append(addFormTextContainer);
    addForm.append(label);
    addForm.append(addFormButtonContainer);
    addFormContainer.append(addForm);
    return addFormContainer;
  }

  addingForm(target) {
    this.target = target;
    const listBoxAddingContainer = this.target.closest('.list-box-adding-container');
    const listBox = listBoxAddingContainer.closest('.list-box');
    const addFormContainer = TrelloUI.createAddForm();
    const listItems = listBox.querySelectorAll('.item');
    if (listItems.length > 3) {
      addFormContainer.classList.add('add-form-container-absolute');
    }
    listBoxAddingContainer.classList.add('hidden');
    listBox.append(addFormContainer);
    const addFormInput = addFormContainer.querySelector('.add-form-input');
    addFormInput.focus();
  }

  removeAddForm(target) {
    this.target = target;
    const listBox = this.target.closest('.list-box');
    const addFormContainer = listBox.querySelector('.add-form-container');
    const listBoxAddingContainer = listBox.querySelector('.list-box-adding-container');
    addFormContainer.remove();
    this.removeValidaiton();
    listBoxAddingContainer.classList.remove('hidden');
  }

  static createErrorMessage() {
    const errorSpan = document.createElement('span');
    errorSpan.className = 'error-span';
    errorSpan.textContent = '';
    return errorSpan;
  }

  removeValidationAddFormInput() {
    const addFormInputs = [...this.trelloBox.querySelectorAll('.add-form-input')];
    const inputErrors = [...this.trelloBox.querySelectorAll('.input-error')];
    for (const addFormInput of addFormInputs) {
      addFormInput.className = 'form-input add-form-input';
    }
    for (const inputError of inputErrors) {
      inputError.remove();
    }

    if (this.allTasks) {
      for (const task of this.allTasks) {
        task.classList.remove('hidden');
      }
    }
  }

  removeValidationAddFormText() {
    const addFormTexts = [...this.trelloBox.querySelectorAll('.add-form-text')];
    const textErrors = [...this.trelloBox.querySelectorAll('.text-error')];
    for (const addFormText of addFormTexts) {
      addFormText.className = 'form-input add-form-text';
    }
    for (const textError of textErrors) {
      textError.remove();
    }
  }

  removeValidaiton() {
    this.removeValidationAddFormInput();
    this.removeValidationAddFormText();
  }

  validateAddFormInput(target) {
    this.removeValidationAddFormInput();
    this.target = target;
    const addForm = this.target.closest('.add-form');
    const addFormInput = addForm.querySelector('.add-form-input');
    const addFormInputContainer = addFormInput.closest('.add-form-input-container');
    if (addFormInput.value === '') {
      addFormInput.classList.add('noValid');
      const errorMessage = TrelloUI.createErrorMessage();
      errorMessage.classList.add('input-error');
      errorMessage.textContent = 'Enter card name!';
      addFormInputContainer.append(errorMessage);
    } else if (!/[а-яА-ЯёЁa-zA-Z0-9]+/g.test(addFormInput.value)) {
      addFormInput.classList.add('noValid');
      const errorMessage = TrelloUI.createErrorMessage();
      errorMessage.classList.add('input-error');
      errorMessage.textContent = 'Card name must include letters or numbers!';
      addFormInputContainer.append(errorMessage);
    }
    // setTimeout(() => {
    //   this.removeValidationAddFormInput();
    // }, 2000);

    this.allTaskHeaders = [...this.trelloBox.querySelectorAll('.card-heading')];
    const finded = this.allTaskHeaders.find((taskHeader) => taskHeader.textContent === addFormInput.value.trim());
    if (finded) {
      addFormInput.classList.add('noValid');
      const errorMessage = TrelloUI.createErrorMessage();
      errorMessage.classList.add('input-error');
      errorMessage.textContent = 'The same heading is already exists!';
      addFormInputContainer.append(errorMessage);
      this.allTasks = [...this.trelloBox.querySelectorAll('.data-item')];
      for (const task of this.allTasks) {
        const header = task.querySelector('.card-heading');
        if (finded.textContent !== header.textContent) {
          task.classList.add('hidden');
        }
      }
    }
  }

  validateAddFormText(target) {
    this.removeValidationAddFormText();
    this.target = target;
    const addForm = this.target.closest('.add-form');
    const addFormText = addForm.querySelector('.add-form-text');
    const addFormTextContainer = addFormText.closest('.add-form-text-container');
    if (addFormText.value === '') {
      addFormText.classList.add('noValid');
      const errorMessage = TrelloUI.createErrorMessage();
      errorMessage.classList.add('text-error');
      errorMessage.textContent = 'Enter description!';
      addFormTextContainer.append(errorMessage);
    } else if (!/[а-яА-ЯёЁa-zA-Z0-9]+/g.test(addFormText.value)) {
      addFormText.classList.add('noValid');
      const errorMessage = TrelloUI.createErrorMessage();
      errorMessage.classList.add('text-error');
      errorMessage.textContent = 'Description must include letters or numbers!';
      addFormTextContainer.append(errorMessage);
    }
    // setTimeout(() => {
    //   this.removeValidationAddFormText();
    // }, 2000);
  }

  validateForm(target) {
    this.target = target;
    this.validateAddFormInput(this.target);
    this.validateAddFormText(this.target);
    const addForm = this.target.closest('.add-form');
    const formInputs = [...addForm.querySelectorAll('.form-input')];
    const noValidInput = formInputs.find((input) => input.classList.contains('noValid'));
    if (noValidInput) {
      noValidInput.focus();
      return false;
    }
    return true;
  }

  createObject(target) {
    this.target = target;
    const addForm = this.target.closest('.add-form');
    const addFormInput = addForm.querySelector('.add-form-input');
    const addFormText = addForm.querySelector('.add-form-text');
    const id = TrelloUI.getID();
    const date = TrelloUI.getDate();
    const number = TrelloUI.getNumber(target);
    const card = new Card(addFormInput.value.trim(), addFormText.value.trim(), id, date, number);
    return card;
  }

  createCard(card) {
    this.card = card;
    const dataItem = document.createElement('li');
    dataItem.className = 'item data-item';
    dataItem.setAttribute('id', `${this.card.id}`);
    const cardContainer = document.createElement('div');
    cardContainer.className = 'card-container';
    const cardInfo = document.createElement('div');
    cardInfo.className = 'card-info';
    const cardContent = document.createElement('div');
    cardContent.className = 'card-content';
    const cardNumber = document.createElement('div');
    cardNumber.className = 'card-number';
    cardNumber.textContent = this.card.number;
    const cardDate = document.createElement('span');
    cardDate.className = 'card-date';
    cardDate.textContent = this.card.date;
    const cardclose = document.createElement('div');
    cardclose.className = 'card-close hidden';
    cardclose.textContent = 'X';
    const cardHeading = document.createElement('h4');
    cardHeading.className = 'card-heading';
    cardHeading.textContent = this.card.heading;
    const cardDescripiton = document.createElement('p');
    cardDescripiton.className = 'card-description';
    cardDescripiton.textContent = this.card.descripiton;
    cardInfo.append(cardNumber);
    cardInfo.append(cardDate);
    cardInfo.append(cardclose);
    cardContent.append(cardHeading);
    cardContent.append(cardDescripiton);
    cardContainer.append(cardInfo);
    cardContainer.append(cardContent);
    dataItem.append(cardContainer);
    return dataItem;
  }

  addingCard(target) {
    this.target = target;
    if (this.validateForm(target)) {
      const listBox = this.target.closest('.list-box');
      const listBoxList = listBox.querySelector('.list-box-list');
      const listBoxAddingContainer = listBox.querySelector('.list-box-adding-container');
      const object = this.createObject(target);
      const card = this.createCard(object);
      this.removeAddForm(target);
      listBoxList.append(card);
      listBoxAddingContainer.classList.remove('hidden');
      this.checkTaskLists();
    }
  }

  getCardRemover(target) {
    this.target = target;
    const card = this.target.closest('.data-item');
    const cardclose = card.querySelector('.card-close');
    cardclose.classList.remove('hidden');
  }

  removeCardRemover(target) {
    this.target = target;
    const card = this.target.closest('.data-item');
    const cardclose = card.querySelector('.card-close');
    cardclose.classList.add('hidden');
  }

  getOrder(list) {
    this.cardList = list;
    const cards = [...this.cardList.querySelectorAll('.data-item')];
    cards.sort((a, b) => a.getAttribute('id') - b.getAttribute('id'));
    let numb = 1;
    for (const card of cards) {
      const cardNumber = card.querySelector('.card-number');
      cardNumber.textContent = numb++;
      this.cardList.append(card);
    }
  }

  removeCard(target) {
    this.target = target;
    const card = this.target.closest('.data-item');
    const cardList = card.closest('.list-box-list');
    card.remove();
    this.getOrder(cardList);
    this.checkTaskLists();
  }

  getData() {
    const data = {
      todo: [],
      inprogress: [],
      done: [],
    };

    const todoList = this.trelloBox.querySelector('.list-box-list-todo');
    const inprogressList = this.trelloBox.querySelector('.list-box-list-inprogress');
    const doneList = this.trelloBox.querySelector('.list-box-list-done');
    const todoCards = [...todoList.querySelectorAll('.data-item')];
    const inprogressCards = [...inprogressList.querySelectorAll('.data-item')];
    const doneCards = [...doneList.querySelectorAll('.data-item')];
    for (const todoCard of todoCards) {
      const heading = todoCard.querySelector('.card-heading');
      const descripiton = todoCard.querySelector('.card-description');
      const id = todoCard.getAttribute('id');
      const date = todoCard.querySelector('.card-date');
      const number = todoCard.querySelector('.card-number');
      const card = new Card(heading.textContent, descripiton.textContent, id, date.textContent, number.textContent);
      data.todo.push(card);
    }
    for (const inprogressCard of inprogressCards) {
      const heading = inprogressCard.querySelector('.card-heading');
      const descripiton = inprogressCard.querySelector('.card-description');
      const id = inprogressCard.getAttribute('id');
      const date = inprogressCard.querySelector('.card-date');
      const number = inprogressCard.querySelector('.card-number');
      const card = new Card(heading.textContent, descripiton.textContent, id, date.textContent, number.textContent);
      data.inprogress.push(card);
    }
    for (const doneCard of doneCards) {
      const heading = doneCard.querySelector('.card-heading');
      const descripiton = doneCard.querySelector('.card-description');
      const id = doneCard.getAttribute('id');
      const date = doneCard.querySelector('.card-date');
      const number = doneCard.querySelector('.card-number');
      const card = new Card(heading.textContent, descripiton.textContent, id, date.textContent, number.textContent);
      data.done.push(card);
    }
    return data;
  }

  saveState() {
    const data = this.getData();
    this.stateService.remove(data);
    this.stateService.save(data);
  }

  loadState() {
    const todoList = this.trelloBox.querySelector('.list-box-list-todo');
    const inprogressList = this.trelloBox.querySelector('.list-box-list-inprogress');
    const doneList = this.trelloBox.querySelector('.list-box-list-done');
    const data = this.stateService.load();
    for (const object of data.todo) {
      const card = this.createCard(object);
      todoList.append(card);
    }
    for (const object of data.inprogress) {
      const card = this.createCard(object);
      inprogressList.append(card);
    }
    for (const object of data.done) {
      const card = this.createCard(object);
      doneList.append(card);
    }
    this.checkTaskLists();
  }

  static getDate() {
    const date = new Date();
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    const month = date.getMonth() < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    return `${day}.${month}.${year}, ${hours}:${minutes}`;
  }

  static getID() {
    const dateID = new Date();
    const dayID = dateID.getDate() < 10 ? `0${dateID.getDate()}` : dateID.getDate();
    const monthID = dateID.getMonth() < 10 ? `0${dateID.getMonth() + 1}` : dateID.getMonth() + 1;
    const yearID = dateID.getFullYear();
    const hoursID = dateID.getHours();
    const minutesID = dateID.getMinutes() < 10 ? `0${dateID.getMinutes()}` : dateID.getMinutes();
    const secondsID = dateID.getSeconds() < 10 ? `0${dateID.getSeconds()}` : dateID.getSeconds();
    return `${yearID}${monthID}${dayID}${hoursID}${minutesID}${secondsID}`;
  }

  static getNumber(target) {
    this.target = target;
    const listBox = this.target.closest('.list-box');
    const listBoxList = listBox.querySelector('.list-box-list');
    const numbArr = listBoxList.querySelectorAll('.data-item');
    const numb = numbArr.length + 1;
    return numb;
  }

  startDrag(event) {
    this.event = event;
    this.target = event.target;
    this.draggedCard = this.target.closest('.data-item');
    this.draggedCardList = this.draggedCard.closest('.list-box-list');
    this.ghostCard = this.draggedCard.cloneNode(true);
    this.dropItems = [...this.trelloBox.querySelectorAll('.list-box-list'), ...this.trelloBox.querySelectorAll('.item')];
    for (const dropItem of this.dropItems) {
      dropItem.style.cursor = 'grabbing';
    }
    this.noDropItems = [this.trelloBox, ...this.trelloBox.querySelectorAll('.list-box-adding-container')];
    for (const noDropItem of this.noDropItems) {
      noDropItem.style.cursor = 'not-allowed';
    }
    this.ghostCard.style.width = `${this.draggedCard.offsetWidth}px`;
    this.ghostCard.style.height = `${this.draggedCard.offsetHeight}px`;
    this.shiftX = this.trelloBox.getBoundingClientRect().left + this.draggedCard.offsetWidth / 2;
    this.shiftY = this.trelloBox.getBoundingClientRect().top + this.draggedCard.offsetHeight / 2;
    this.draggedCard.classList.add('dragged');
    this.ghostCard.classList.add('ghost');
    this.trelloBox.append(this.ghostCard);
    this.ghostCard.style.left = `${this.event.clientX - this.shiftX}px`;
    this.ghostCard.style.top = `${this.event.clientY - this.shiftY}px`;
  }

  moveAt(event) {
    this.event = event;
    this.target = event.target;
    this.currentTarget = event.currentTarget;
    this.closest = document.elementFromPoint(this.event.clientX, this.event.clientY);
    this.ghostCard.style.left = `${this.event.clientX - this.shiftX}px`;
    this.ghostCard.style.top = `${this.event.clientY - this.shiftY}px`;
    if (this.closest.closest('.item')) {
      const needCard = this.closest.closest('.item');
      const needCardCoords = needCard.getBoundingClientRect();
      const needCardCenter = needCardCoords.y + needCardCoords.height / 2;
      if (this.event.clientY < needCardCenter) {
        needCard.before(this.draggedCard);
      } else {
        needCard.after(this.draggedCard);
      }
    } else {
      this.draggedCardList.prepend(this.draggedCard);
    }
  }

  removeAt() {
    this.ghostCard.remove();
    this.draggedCard.classList.remove('dragged');
    for (const dropItem of this.dropItems) {
      dropItem.style.cursor = '';
    }
    for (const noDropItem of this.noDropItems) {
      noDropItem.style.cursor = '';
    }
    this.dropItems = null;
    this.noDropItems = null;
    this.draggedCard = null;
    this.ghostCard = null;
    this.closest = null;
  }

  finishDrag(event) {
    this.event = event;
    this.target = event.target;
    this.droppedCardList = this.draggedCard.closest('.list-box-list');
    this.ghostCard.remove();
    this.draggedCard.classList.remove('dragged');
    this.checkTaskLists();
    this.getOrder(this.draggedCardList);
    this.getOrder(this.droppedCardList);
    for (const dropItem of this.dropItems) {
      dropItem.style.cursor = '';
    }
    for (const noDropItem of this.noDropItems) {
      noDropItem.style.cursor = '';
    }
    this.dropItems = null;
    this.noDropItems = null;
    this.draggedCard = null;
    this.ghostCard = null;
    this.closest = null;
  }
}

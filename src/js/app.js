import TrelloUI from './TrelloUI.js';
import StateService from './StateService.js';
import TrelloController from './TrelloController.js';

const mainContainer = document.getElementById('mainContainer');
const stateService = new StateService(localStorage);
const trello1 = new TrelloUI(mainContainer, stateService);

const trelloController1 = new TrelloController(mainContainer, trello1);
trelloController1.drowUI();
trelloController1.checkLists();

trelloController1.control();

// ==================================

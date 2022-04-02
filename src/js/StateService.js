export default class StateService {
  constructor(storage) {
    this.storage = storage;
  }

  remove() {
    this.storage.removeItem('state');
  }

  save(state) {
    this.storage.setItem('state', JSON.stringify(state));
  }

  load() {
    try {
      return JSON.parse(this.storage.getItem('state'));
    } catch (error) {
      throw new Error('Error loading data!');
    }
  }
}

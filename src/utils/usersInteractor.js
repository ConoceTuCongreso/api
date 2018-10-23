const interactor = require('./Interactor');

class UserInteractor extends interactor {
  saveUser() {
    this.getDB();
  }

  getUser() {
    this.getDB();
  }
}

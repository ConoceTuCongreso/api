const bcryptInstance = require('bcrypt');

class Encryptor {
  constructor() {
    this.init();
  }

  init() {
    this.bcrypt = bcryptInstance;
    this.saltRounds = 10;
  }

  encrypt(password) {
    return this.bcrypt.genSalt(this.saltRounds)
      .then(salt => this.bcrypt.hash(password, salt)
        .then((hash) => {
          const hashWithSalt = {
            password: hash,
            salt,
          };
          return hashWithSalt;
        }));
  }

  compare(password, passwordHash) {
    return this.bcrypt.compare(password, passwordHash)
      .then((match) => {
        const toReturn = match;
        return toReturn;
      });
  }
}

module.exports = Encryptor;

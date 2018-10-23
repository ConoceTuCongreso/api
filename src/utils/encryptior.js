const bcryptInstance = require('bcrypt');

class Encryptor {
  constructor() {
    this.init();
  }

  init() {
    this.bcrypt = bcryptInstance;
    this.saltRounds = 10;
  }

  async encrypt(password) {
    try {
      const salt = await this.bcrypt.genSalt(this.saltRounds);
      const hash = await this.bcrypt.hash(password, salt);
      const hashWithSalt = {
        password: hash,
        salt,
      };
      return hashWithSalt;
    } catch (e) {
      return e;
    }
  }

  async compare(password, passwordHash) {
    const match = await this.bcrypt.compare(password, passwordHash);
    return match;
  }
}

module.exports = Encryptor;

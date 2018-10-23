class User {
  constructor(firstName, username, middleName, lastName, email, salt, hash) {
    this.first_name = firstName;
    this.username = username;
    this.middle_name = middleName || '';
    this.last_name = lastName;
    this.email = email;
    this.salt = salt;
    this.hash = hash;
  }
}

module.exports = User;

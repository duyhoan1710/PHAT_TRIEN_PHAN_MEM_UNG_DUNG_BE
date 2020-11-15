const { Model } = require('objection');

class User extends Model {
  static get tableName() {
    return 'users';
  }

  static async emailExists(email) {
    const user = await User.query()
      .findOne('email', email);
    return !!user;
  }
}

module.exports = User;

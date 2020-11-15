const { Model } = require('objection');

class Task extends Model {
  static get tableName() {
    return 'projects';
  }
}

module.exports = Task;

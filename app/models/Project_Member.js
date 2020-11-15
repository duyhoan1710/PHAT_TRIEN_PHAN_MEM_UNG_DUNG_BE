const { Model } = require('objection');

class Task extends Model {
  static get tableName() {
    return 'projects_members';
  }
}

module.exports = Task;

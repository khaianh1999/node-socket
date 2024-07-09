const BaseModel = require('./baseModel');

class UsersModel extends BaseModel {
  constructor() {
    super('core_users');
  }
}

module.exports = new UsersModel();

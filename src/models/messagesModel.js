const BaseModel = require('./baseModel');

class MessageModel extends BaseModel {
  constructor() {
    super('core_messages');
  }
}

module.exports = new MessageModel();

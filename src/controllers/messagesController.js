const BaseController = require('./baseController');
const messageModel = require('../models/messageModel');

class MessagesController extends BaseController {
  constructor() {
    super(messageModel);
  }
}

module.exports = new MessagesController();

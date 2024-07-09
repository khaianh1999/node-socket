const BaseController = require('./baseController');
const userModel = require('../models/usersModel');

class UsersController extends BaseController {
  constructor() {
    super(userModel);
  }
}

module.exports = new UsersController();

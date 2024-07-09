const express = require('express');
const usersController = require('../controllers/usersController');

const router = express.Router();

router.post('/users', usersController.create.bind(usersController));
router.get('/users/:id', usersController.findById.bind(usersController));
router.get('/users', usersController.findAll.bind(usersController));
router.put('/users/:id', usersController.update.bind(usersController));
router.delete('/users/:id', usersController.delete.bind(usersController));

module.exports = router;

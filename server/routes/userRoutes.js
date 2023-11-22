const express = require('express');
const router = express.Router();
const userController = require('../actions/userController');

router.get('/', userController.getAll);

module.exports = router;
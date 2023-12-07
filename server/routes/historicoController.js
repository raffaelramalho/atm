const express = require('express')
const router = express.Router()

const {
    logGetter,
    dashboardFilter  // Importe o novo módulo
} = require('../controllers/getLog');

router.route('/').get(logGetter);

module.exports = router;

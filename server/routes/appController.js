const express = require('express')
const router = express.Router()

const {
    turnGetter,
} = require('../controllers/getTurn');
const {
    dataProcess
} = require('../controllers/userUpdater')

router.route('/').get(turnGetter);
router.route('/').post(dataProcess);

module.exports = router;
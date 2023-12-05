const express = require('express')
const router = express.Router()


const {
    feriasProcess
} = require('../controllers/feriasUpdater')


router.route('/').post(feriasProcess);

module.exports = router;
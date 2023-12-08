const express = require('express')
const router = express.Router()


const {
    dataProcess
} = require('../controllers/userSheetUpdater')


router.route('/').post(dataProcess);

module.exports = router;
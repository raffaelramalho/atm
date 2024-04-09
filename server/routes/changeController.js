const express = require('express')
const router = express.Router()


const {
    logGetter,
} = require('../controllers/getChange')


router.route('/').get(logGetter);




module.exports = router;
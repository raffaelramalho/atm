const express = require('express')
const router = express.Router()


const {
    liberarGeral,
} = require('../controllers/liberarGeral')


router.route('/').post(liberarGeral);


module.exports = router;
const express = require('express')
const router = express.Router()


const {
    exception,
} = require('../controllers/excecaoInsert')


router.route('/').post(exception);


module.exports = router;
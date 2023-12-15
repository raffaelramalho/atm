const express = require('express')
const router = express.Router()


const {
    sabadoInsert,
} = require('../controllers/sabadoFunctions')


router.route('/').post(sabadoInsert);


module.exports = router;
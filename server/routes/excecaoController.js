const express = require('express')
const router = express.Router()


const {
    search,
   
} = require('../controllers/excecaoUpdater')


router.route('/').get(search);




module.exports = router;
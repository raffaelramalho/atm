const express = require('express')
const router = express.Router()

const {
    searchGetter,
} = require('../controllers/historicoSearch');

router.route('/').get(searchGetter);


module.exports = router;
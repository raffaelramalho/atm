const express = require('express')
const router = express.Router()



const {
    loginValidation,
} = require('../controllers/authenticate')



// Rota de login
router.route('/').post(loginValidation);

module.exports = router;
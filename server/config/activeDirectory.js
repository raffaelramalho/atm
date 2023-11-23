const ActiveDirectory = require('activedirectory');
const dotenv = require('dotenv');

dotenv.config();


const config = {
    url: process.env.AD_URL, 
    baseDN: process.env.DOMAIN_CONTROLLER, 
    username: process.env.AD_USERNAME, 
    password: process.env.AD_PASSWORD, 
}

const ad = new ActiveDirectory(config);

module.exports = ad;
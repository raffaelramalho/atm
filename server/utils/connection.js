const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password:process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT
}
const connection = mysql.createPool({
  
    host: "localhost",
    user: "root",
    password: "1234",
    database: "acessos",
    port: "3305"

  });


module.exports = connection.promise();
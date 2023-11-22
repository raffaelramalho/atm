const mysql = require('mysql2');

const connection = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "acesso",
    port: 3306
  });


module.exports = connection.promise();
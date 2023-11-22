const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require("express");
const dbconnection = require('./utils/connection');


const PORT = process.env.PORT || 3307;
const app = express();

//Interação com as informações vindas do banco
var Turn = ''

/////////////////////////////////////////////////

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

  
dbconnection.getConnection((error) => {
  if (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
  } else {
    console.log('Conectado ao banco de dados');
  }
});


app.get("/api", (req, res) => {
  res.json({ message: "Deu certo man =D" });
});

app.listen(PORT, () => {
  console.log(`Servidor ${PORT}`);
});

app.get("/getTurnos", async (req, res) => {
  console.log("/getTurnos acessada");

  try {
    const [results] = await dbconnection.execute('SELECT name FROM scheduls');
    const turnos = results.map((result) => result.name);
    return res.json(turnos);
  } catch (error) {
    console.error('Erro ao buscar os turnos:', error);
    res.status(500).send('Erro no servidor');
  }
});

app.post("/processar-dados", async (req, res) => {
  console.log('/processar-dados acessada');

  try {
    console.log(req.body)
    const userNameList = req.body.nameList;
    const Turn = req.body.newTurn;
   
    if (!userNameList || userNameList.length === 0) {
      return res.status(400).send('A lista de nomes não pode estar vazia.');
    }

    const { userIdList, validUsers, errorNameList } = await getAllUsers(dbconnection, userNameList);

    updateUsers(dbconnection, userIdList, Turn);

    console.log(errorNameList)
    res.send({ nomes: validUsers, id: userIdList, invalidos: errorNameList });
    
  } catch (error) {
    console.error('Erro durante as consultas assíncronas:', error);
    res.status(500).send('Erro no servidor');
  }
});

async function getAllUsers(dbconnection, userNameList) {
  const userIdList = [];
  let errorNameList = [];
  const validUsers = [];

  for (let nome of userNameList) {
    const query = `SELECT id FROM Users WHERE name = ?`;

    try {
      const [results] = await dbconnection.execute(query, [nome]);

      if (results.length > 0) {
        userIdList.push(results[0].id);
        validUsers.push(nome);
      } else {
        errorNameList.push(nome);
      }
    } catch (error) {
      console.error('Erro durante a consulta ao banco de dados:', error);
      throw error; 
    }
  }
  
  return { userIdList, validUsers, errorNameList };
}

async function updateUsers(dbconnection, userIdList,Turn){
  
    const turnId = await dbconnection.execute(`SELECT id from scheduls WHERE NAME='${Turn}' AND id is NOT NULL LIMIT 1`);
    
    for (user of userIdList) {
        const query = await dbconnection.execute(`update useraccessrules set idAccessRule = ${turnId[0][0].id} where idUser = ${user}`);

    }
}





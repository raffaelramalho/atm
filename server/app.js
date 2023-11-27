const bodyParser = require('body-parser');
const cors = require('cors');
const express = require("express");
const dbconnection = require('./utils/connection');
const jwt = require('jsonwebtoken');
const PORT = process.env.PORT || 3307;
const app = express();


// Interação com as informações vindas do banco 🗿🍷
var Turn = '' // Variável Turno inicializada

// Configuração de middlewares
app.use(cors()); // Permite solicitações de outros domínios
app.use(bodyParser.json()); // Para interpretar corpos de requisição em JSON
app.use(bodyParser.urlencoded({ extended: true })); // Para interpretar dados de formulário

// Conexão com o banco de dados
dbconnection.getConnection((error) => {
  if (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
  } else {
    console.log('Conectado ao banco de dados');
  }
});

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Servidor ${PORT}`);
});

// Rota para obter turnos
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

// Rota para processar dados
app.post("/processar-dados", async (req, res) => {
  console.log('/processar-dados acessada');

  try {
    console.log(req.body);
    const userNameList = req.body.nameList;
    const Turn = req.body.newTurn;

    if (!userNameList || userNameList.length === 0) {
      return res.status(400).send('A lista de nomes não pode estar vazia.');
    }

    // Função para obter informações sobre os usuários
    const { userIdList, validUsers, errorNameList } = await getAllUsers(dbconnection, userNameList);

    // Atualiza os usuários no banco de dados
    updateUsers(dbconnection, userIdList, Turn);

    res.send({ nomes: validUsers, id: userIdList, invalidos: errorNameList });

  } catch (error) {
    console.error('Erro durante as consultas assíncronas:', error);
    res.status(500).send('Erro no servidor');
  }
});

// Rota de login
app.post('/login', async (req, res) => {
  console.log('/login acessada')
  
  try {
    const formLogin = req.body.formLogin;
    const formPassword = req.body.formPassword;

    // Verifica se os campos não estão vazios
    if (!formLogin || !formPassword) {
      return res.status(400).send('Os campos não podem estar vazios.');
    }

    // Validação do usuário
    const session = await userValidation(dbconnection, formLogin, formPassword);
    res.send({token: session});

  } catch (error) {
    console.error('Erro durante a autenticação', error);
    res.status(500).send('Erro no servidor');
  }
});

// Função assíncrona para validar um usuário no banco de dados
async function userValidation(dbconnection, formLogin, formPassword) {
  console.log(formLogin); // Log: Exibe o nome do usuário recebido para fins de depuração
  try {
    // Consulta para obter o ID do usuário com o nome fornecido
    const query = `SELECT localId FROM atm  WHERE localId = '${formLogin}'`;
    var result = await dbconnection.execute(query);

    console.log(result[0][0]['localId']); // Log: Exibe o primeiro resultado da consulta para fins de depuração
    
       // Verifica se o usuário foi encontrado
    if (result[0][0]['localId'] != 0 && result[0][0]['localId'] != "" ) { 
        console.log("Nome encontrado com sucesso"); // Log: Exibe uma mensagem indicando que o nome foi encontrado
        // Consulta para contar o número de registros com o nome e senha fornecidos
        const queryFinal = `SELECT COUNT(*) FROM atm WHERE localId = '${formLogin}' AND password = '${formPassword}'`;
        result = await dbconnection.execute(queryFinal);
        console.log(result[0][0]); // Log: Exibe a contagem para fins de depuração

        // Verifica se a senha está correta
        if (result[0][0]['COUNT(*)'] > 0) {
          const token = generateToken(formLogin); // Gera um token JWT usando a função auxiliar
          console.log(token); // Log: Exibe o token gerado para fins de depuração
          return { ok: true, token }; // Retorna um objeto indicando sucesso e o token
        } else {
          console.log("Senha incorreta"); // Log: Exibe uma mensagem indicando que a senha está incorreta
          return { ok: false, message: 'Usuario ou Senha incorreta' }; // Retorna um objeto indicando falha e uma mensagem
        }
    } else {
      return { ok: false, message: 'Usuario ou Senha incorreta' }; // Retorna um objeto indicando falha e uma mensagem
    }
    
  } catch (error) {
    console.error('Erro durante a consulta ao banco de dados:', error); // Log: Exibe um erro se ocorrer uma exceção
    throw error; // Lança a exceção para tratamento em um nível superior
  }
}


// Função para obter informações sobre todos os usuários
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
        if (nome !== '') {
          errorNameList.push(nome);
        }
      }
    } catch (error) {
      console.error('Erro durante a consulta ao banco de dados:', error);
      throw error;
    }
  }

  return { userIdList, validUsers, errorNameList };
}

// Função para atualizar usuários no banco de dados
async function updateUsers(dbconnection, userIdList, Turn) {
  try {
    const turnIdResult = await dbconnection.execute(
      `SELECT id from scheduls WHERE NAME='${Turn}' AND id is NOT NULL LIMIT 1`
    );

    if (turnIdResult && turnIdResult[0] && turnIdResult[0][0]) {
      const turnId = turnIdResult[0][0].id;

      for (const user of userIdList) {
        const queryResult = await dbconnection.execute(
          `UPDATE useraccessrules SET idAccessRule = ${turnId} WHERE idUser = ${user}`
        );

        if (queryResult && queryResult[0] && queryResult[0].affectedRows !== 1) {
          console.error(`Failed to update useraccessrules for user ${user}`);
        }
      }
    } else {
      console.error(`Turn not found or has no valid id for name: ${Turn}`);
    }
  } catch (error) {
    console.error('Error during updateUsers:', error);
  }
}

// Função para gerar token JWT
function generateToken(formLogin) {
  const payload = {
    username: formLogin,
    userEmail: Math.random(),
  };
  const token = jwt.sign(payload, 'delp', { expiresIn: '1h' });

  return token;
}




module.exports = app;
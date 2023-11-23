const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require("express");
const dbconnection = require('./utils/connection');
const authController = require('./controllers/authenticate');
const jwt = require('jsonwebtoken');
const PORT = process.env.PORT || 3307;
const app = express();

// Interação com as informações vindas do banco
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

// Rota inicial
app.get("/api", (req, res) => {
  res.json({ message: "Deu certo man =D" });
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
    res.send(session);

  } catch (error) {
    console.error('Erro durante a autenticação', error);
    res.status(500).send('Erro no servidor');
  }
});

// Função para validar usuário
async function userValidation(dbconnection, formLogin, formPassword) {
  console.log(formLogin)
  try {
    const query = `SELECT id FROM users  WHERE name = '${formLogin}'`
    var result = await dbconnection.execute(query);
    console.log(result)
    console.log(result[0][0])
    if (result[0][0]) {
      console.log('Chegou aqui')
      if (result.id !== 0) {
        console.log("Nome encontrado com sucesso")
        const queryFinal = `SELECT COUNT(*) FROM users WHERE name = '${formLogin}' AND senha = '${formPassword}'`
        result = await dbconnection.execute(queryFinal);
        console.log(result[0][0]['COUNT(*)'])
        if (result[0][0]['COUNT(*)'] > 0) {
          const token = generateToken(formLogin);
          console.log(token)
          return { ok: true, token };
        } else {
          console.log("Senha incorreta")
          return { ok: false, message: 'Email ou Senha incorreta' }
        }
      }

    } else {
      return { ok: false, message: 'Email ou Senha incorreta' }
    }

  } catch (error) {
    console.error('Erro durante a consulta ao banco de dados:', error);
    throw error;
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
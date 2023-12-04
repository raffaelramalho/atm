const asyncWrapper = require('../middleware/async');
const dbconnection = require('../utils/connection')
const jwt = require('jsonwebtoken');

const loginValidation = 
asyncWrapper( async (req,res ) => {
    console.log('Iniciando Validação')
    const formLogin = req.body.formLogin;
    const formPassword = req.body.formPassword;
    if (!formLogin || !formPassword) {
      return res.status(400).send('Os campos não podem estar vazios.');
    }
    const session = await userValidation(dbconnection, formLogin, formPassword);
    res.send({token: session});
});

const generateTokenSession = 
asyncWrapper( async (formLogin) => {
    console.log('Gerando Token....')
    const payload = {
      username: formLogin,
      salt: Math.random(),
      timestamp: Date.now(),
    };
    const token = jwt.sign(payload, 'delp', { expiresIn: '1h' });
    return token;
});



async function userValidation(dbconnection, formLogin, formPassword) {
  try {
    
    const query = `SELECT delpUser FROM atm  WHERE delpUser = '${formLogin}'`;
    var result = await dbconnection.execute(query);
    if (result[0][0]['delpUser'] != 0 && result[0][0]['delpUser'] != "" ) { 
        console.log("Nome encontrado com sucesso"); 
        const queryFinal = `SELECT COUNT(*) FROM atm WHERE delpUser = '${formLogin}' AND password = '${formPassword}'`;
        result = await dbconnection.execute(queryFinal);
        if (result[0][0]['COUNT(*)'] > 0) {
          const token = await generateTokenSession(formLogin); 
          return { ok: true, token: token }; 
        } else {
          console.log("Senha incorreta"); 
          return { ok: false, message: 'Usuario ou Senha incorreta' }; 
        }
    } else {
      return { ok: false, message: 'Usuario ou Senha incorreta' }; 
    } 
  } catch (error) {
    console.error('Erro durante a consulta ao banco de dados:', error); 
    throw error; 
  }
}


module.exports = {
  loginValidation
}
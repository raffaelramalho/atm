const asyncWrapper = require('../middleware/async');
const dbconnection = require('../utils/connection')
const jwt = require('jsonwebtoken');

const loginValidation = 
asyncWrapper( async (req,res ) => {
    const formLogin = req.body.formLogin;
    const formPassword = req.body.formPassword;
    if (!formLogin || !formPassword) {
      return res.status(400).send('Os campos não podem estar vazios.');
    }
    const session = await userValidation(dbconnection, formLogin, formPassword);
    res.send({token: session });
});

const generateTokenSession = async (formLogin, formPassword, userRole) => {
  try {
    let role = '';

    if (userRole === 1) {
      role = 'portaria';
    } else if (userRole === 2) {
      role = 'rh';
    } else if (userRole === 3) {
      role = 'admin';
    } else {
      role = 'basico';
    }
    const payload = {
      username: formLogin,
      salt: Math.random(),
      role: role,
    };

    const token = jwt.sign(payload, 'delp', { expiresIn: '1h' });
    return token;
  } catch (error) {
    console.error('Erro durante a geração do token:', error);
    throw error;
  }
};


async function userValidation(dbconnection, formLogin, formPassword) {
  try {
    
    const query = `SELECT delpUser FROM atm  WHERE delpUser = '${formLogin}'`;
    var result = await dbconnection.execute(query);
    if (result[0][0]['delpUser'] != 0 && result[0][0]['delpUser'] != "" ) { 
        const queryFinal = `SELECT COUNT(*) FROM atm WHERE delpUser = '${formLogin}' AND password = '${formPassword}'`;
        result = await dbconnection.execute(queryFinal);
        if (result[0][0]['COUNT(*)'] > 0) {
          const [getRole] = await dbconnection.execute(`SELECT level FROM atm where delpUser = ? AND password = ?`,[formLogin, formPassword])
          const token = await generateTokenSession(formLogin, formPassword,getRole[0]['level']);

          return { ok: true, token: token }; 
        } else {
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
const asyncWrapper = require('../middleware/async');
const dbconnection = require('../utils/connection');


const feriasProcess = asyncWrapper (async (req,res) =>{
    const userNameList = req.body.nameList;
    const dataFim = req.body.dataFim;
    const { userMatricula,userName, userId, userInvalid } = await userExist(dbconnection, userNameList);
    const { notUpdated } = await updateUsers(dbconnection, userMatricula, userName, userId, dataFim);
    const updatedUserName = removeNotUpdatedNames(userName, notUpdated);
    return res.send({ 
            matricula:userMatricula, 
            nome:updatedUserName, 
            id:userId, 
            invalido:userInvalid,
            naoAtualizado: notUpdated,
            feriasFim: dataFim   });
})


async function userExist(dbconnection, userNameList) {
            const userMatricula = []
            const userName = [];
            const userId = [];
            const userInvalid  = [];

            //nome sendo usado mas é registration
            for (let nome of userNameList) {
              const query = `SELECT name,id FROM Users WHERE registration = ? and deleted = 0 limit 1`;
              try {
                const [results] = await dbconnection.execute(query, [nome]);
                if( results.length > 0){
                    const matricula = [results][0][0]['name'];
                    const id = [results][0][0]['id']
                    userMatricula.push(matricula)
                    userId.push(id)
                    userName.push(nome)
                } else {
                    if (nome !== ''){
                        userInvalid.push(nome)
                    }
                }
              } catch (error) {
                console.error('Erro durante a consulta ao banco de dados:', error);
                throw error;
              }
            }
            
            return { userId, userName, userMatricula, userInvalid };
          }


          async function updateUsers(dbconnection, userMatricula, userName, userId, dataFim){
            const notUpdated = []
            for (let i = 0; i < userId.length; i++){
                const query = `UPDATE users
                SET dateStartLimit = ? 
                WHERE id = ? and registration = ? AND deleted = 0;`;
                const [result] = await dbconnection.execute(query, [`${dataFim} 23:59:59`, userId[i], userName[i]]);
            }
            return { notUpdated };
        }
        

function removeNotUpdatedNames(userMatricula, notUpdated) {
    return userMatricula.filter(name => !notUpdated.includes(name));
}
module.exports = {
    feriasProcess
}
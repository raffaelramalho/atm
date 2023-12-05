const asyncWrapper = require('../middleware/async');
const dbconnection = require('../utils/connection');


const feriasProcess = asyncWrapper (async (req,res) =>{
   
    const userNameList = req.body.nameList;
    const dataInicio = req.body.dataInicio;
    const dataFim = req.body.dataFim;

    const { userMatricula,userName, userId, userInvalid } = await userExist(dbconnection, userNameList);
    const { notUpdated } = await updateUsers(dbconnection, userMatricula, userName, userId, dataInicio, dataFim);
    const updatedUserName = removeNotUpdatedNames(userName, notUpdated);
    return res.send({ 
            matricula:userMatricula, 
            nome:updatedUserName, 
            id:userId, 
            invalido:userInvalid,
            naoAtualizado: notUpdated,
            feriasInicio: dataInicio,
            feriasFim: dataFim   });
})


async function userExist(dbconnection, userNameList) {
            const userMatricula = []
            const userName = [];
            const userId = [];
            const userInvalid  = [];

            for (let nome of userNameList) {
              const query = `SELECT registration,id FROM Users WHERE name = ? and deleted = 0 limit 1`;
              try {
                const [results] = await dbconnection.execute(query, [nome]);
                if( results.length > 0){
                    console.log("Resultados"+ JSON.stringify([results]))
                    const matricula = [results][0][0]['registration'];
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


          async function updateUsers(dbconnection, userMatricula, userName, userId, dataInicio, dataFim){
            console.log('Lançando férias...')
            const notUpdated = []
            for (let i = 0; i < userId.length; i++){
                console.log('Ferias para: '+userName[i])
                const query = `UPDATE users
                SET dateLimit = ? , dateStartLimit = ?
                WHERE id = ? and registration = ? AND deleted = 0;`;
                console.log(`UPDATE users SET dateLimit = '${dataFim} 23:59:59', dateStartLimit = '${dataInicio} 00:00:00' WHERE id = ${userId[i]} and registration = ${userMatricula[i]} AND deleted = 0;`)
                const [result] = await dbconnection.execute(query, [`${dataFim} 23:59:59`, `${dataInicio} 00:00:00`, userId[i], userMatricula[i]]);
            }
            return { notUpdated };
        }
        
        
function removeNotUpdatedNames(userName, notUpdated) {
    return userName.filter(name => !notUpdated.includes(name));
}



module.exports = {
    feriasProcess
}
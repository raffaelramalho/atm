const asyncWrapper = require('../middleware/async');
const dbconnection = require('../utils/connection');




const dataProcessSheet = asyncWrapper (async (req,res) => {
    const sheet = req.body
    const nameList = sheet.LinhaUm
    const regList = req.body.LinhaZero
    const turnList = req.body.LinhaDois
    const { userMatricula, 
        userName, 
        userId, 
        userInvalid,
          } = await userExist(dbconnection, nameList);
    const { notUpdated, 
            turnIdList
      } = await updateUsersSheet(dbconnection, userMatricula, userName, userId, turnList);
    console.log(turnIdList)
    scheduleDeletion(dbconnection,userId,turnIdList)
    return res.send({ 
            matricula:userMatricula, 
            nome:updatedUserName, 
            id:userId, 
            invalido:userInvalid,
            naoAtualizado: notUpdated   });
})


async function userExist(dbconnection, userNameList) {
            const userMatricula = []
            const userName = []
            const userId = []
            const userInvalid  = []
            
            for (let nome of userNameList) {
              const query = `SELECT name,id FROM Users WHERE registration = ? and deleted = 0 limit 1`;
              try {
                const [results] = await dbconnection.execute(query, [nome]);
                if( results.length > 0){
                    console.log("Resultados"+ JSON.stringify([results]))
                    const matricula = [results][0][0]['name'];
                    const id = [results][0][0]['id']
                    userMatricula.push(nome)
                    userId.push(id)
                    userName.push(matricula)
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



async function updateUsersSheet(dbconnection, userMatricula, userName, userId, turn){
    console.log('Atualizando usuários')
    const notUpdated = []
    const turnIdList = []
    for(let y = 0; y<turn.length;y++){
        const queryTurn = await dbconnection.execute(`SELECT id from groups WHERE NAME='${turn[y]}'`);
        turnIdList.push(JSON.stringify([queryTurn][0][0][0]['id']))
        console.log([queryTurn][0][0][0]['id'])
    }
    console.log('ID do turno obtido com sucesso')
    for (let i = 0; i < userId.length; i++){
        console.log('Verificando id: '+userId[i])
        const query = `select g.id from usergroups ug inner join groups g on g.id=ug.idGroup inner join users u on u.id=ug.idUser where u.deleted = 0 and g.idType = 1 and u.registration = ? and u.id = ? limit 1;`;
        const [result] = await dbconnection.execute(query, [userName[i], userId[i]]);
        if(result[0]){
            const turnOld = JSON.stringify(result[0]['id'])
            if(turnOld == '1002' ){
                console.log(userMatricula[i]+' é mensalista e não foi alterado')
                notUpdated.push(userMatricula[i])
            } else {
                const updateQuery = `into usergroups(idUser, idGroup, isVisitor) values (?,?,0);`
                const update = await dbconnection.execute(updateQuery,[  userId[i],turnIdList[i]])
                console.log(userName[i]+' foi atualizado com sucesso')
                await logInsert(dbconnection,userName[i],userMatricula[i],turnOld,turn,userId[i])
            }
        } else{
            console.log(userName[i]+' não possui grupo');
            const insertQuery = `insert into usergroups(idUser, idGroup, isVisitor) values (?,?,0);`
            const insert = await dbconnection.execute(insertQuery,[userId[i], turnIdList[i]])
            console.log('Inserido com sucesso!')
        }
    }
    console.log('retornando valores...'+turnIdList)
    return { notUpdated,turnIdList };
}

async function  logInsert(dbconnection, nome, matricula, oldTurn, newTurn,userId) {
    console.log('Salvando no log....')
    const query = 'insert into DeleteQueue(comando,horarioExecucao,nome,registration,oldTurn,newTurn) values (?,?,?,?,?,?)';
    const proxDomingo = await getNextSunday()
    const queryCommand = `delete from usergroups where idUser = ${userId} and idGroup = ${oldTurn}`
    console.log(proxDomingo)
    try{
        const [result] = await dbconnection.execute(query,[queryCommand,proxDomingo,nome,matricula,oldTurn,newTurn])
        console.log('Log cadastrado com sucesso!')
    }catch(error){
        console.log(error)
    }
  } 


function removeNotUpdatedNames(userName, notUpdated) {
    return userName.filter(name => !notUpdated.includes(name));
}



module.exports = {
    dataProcessSheet
}
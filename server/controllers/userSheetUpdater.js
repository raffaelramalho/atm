const { json } = require('express');
const asyncWrapper = require('../middleware/async');
const dbconnection = require('../utils/connection');
const moment = require('moment');

const dataProcess = asyncWrapper (async (req,res) =>{
    const userNameList = req.body.nameList;
    const turn = req.body.newTurn;  
    if (!userNameList || userNameList.length === 0) {
        return res.status(400).send('A lista de nomes não pode estar vazia.');
    }
    const { userMatricula, 
            userName, 
            userId, 
            userInvalid 
          } = await userExist(dbconnection, userNameList);
            console.log(userId , userMatricula, userName,userInvalid)
    const { notUpdated,turnIdList } = await updateUsers(dbconnection, userMatricula, userName, userId, turn);
    const updatedUserName = removeNotUpdatedNames(userMatricula, notUpdated);
    return res.send({ 
            matricula:updatedUserName,
            nome: updatedUserName,
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
      const query = 'SELECT name,id FROM Users WHERE registration = ? and deleted = 0 limit 1';
      try {
        const [results] = await dbconnection.execute(query, [nome]);
        if( results.length > 0){
            const matricula = results[0]['name'];
            const id = results[0]['id']
            userMatricula.push(nome)
            userId.push(id)
            userName.push(matricula)
        } else {
            if (nome !== ''){
                userInvalid.push(nome)
            }
        }
      } catch (error) {
        throw error;
      }
    }
    
    return { userId, userName, userMatricula, userInvalid };
}



  async function updateUsers(dbconnection, userMatricula, userName, userId, turn){
    const notUpdated = []
    const oldTurnList = []
    const turnIdList = []
    const [queryTurn] = await dbconnection.execute('SELECT id from groups WHERE NAME=?', [turn]);
    const turnNew = JSON.stringify(queryTurn[0]['id'])
    for (let i = 0; i < userId.length; i++){
        console.log(userMatricula[i], userId[i])
        const [result] = await dbconnection.execute('select g.id from usergroups ug inner join groups g on g.id=ug.idGroup inner join users u on u.id=ug.idUser where u.deleted = 0 and g.idType = 1 and u.registration = ? and u.id = ? limit 1;', [userMatricula[i], userId[i]]);
        if(result[0]){
            const turnOld = JSON.stringify(result[0]['id'])
            oldTurnList.push(turnOld)
            if(turnOld != '1002' ){
                console.log("Preparando para registrar log...")
                turnIdList.push(turnOld)
                const query = 'insert into usergroups(idUser, idGroup) values (?,?);'
                await dbconnection.execute(query, [userId[i],turnNew])
                console.log('inserido')
                await logInsert(dbconnection,userName[i],userMatricula[i],turnOld,turnNew,userId[i])
            } else {
                notUpdated.push(userMatricula[i])
            }
        } else{
            await dbconnection.execute('insert into usergroups(idUser, idGroup, isVisitor) values (?,?,0);', [userId[i], turnNew])
        }
    }
    return { notUpdated, turnIdList };
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

async function scheduleDeletion(dbconnection, id,grupo ) {
    console.log('Marcando a exclusão da exceção');
    const deleteId = id
    const deleteGrupo = grupo
    setTimeout(async () => {
        try {
                const query = `delete from usergroups where idUser = ? and idGroup = ?`
                console.log(`delete from usergroups where idUser = ${id} and idGroup = ${grupo}`)
                await dbconnection.execute(query,[id,grupo])
                console.log('Linha deletada com sucesso!');
        } catch (error) {
            console.error('Erro ao deletar a linha:', error);
        }
    }, 30 * 1000); // 60* 30 * 1000
}


function removeNotUpdatedNames(userName, notUpdated) {
    console.log("removendo..."+userName,notUpdated)
    return userName.filter(name => !notUpdated.includes(name));
}

async function getNextSunday() {
    // Obtenha a data atual
    let now = moment();
    // Calcule o próximo domingo
    let nextSunday = now.day(7);
    // Defina a hora para 23:59
    nextSunday.hour(23).minute(59).second(0);
    // Formate a data no formato aceito pelo MySQL
    let mysqlFormat = nextSunday.format('YYYY-MM-DD HH:mm:ss');
    return mysqlFormat;
  }

module.exports = {
    dataProcess,
}
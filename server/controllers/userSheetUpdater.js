const { json } = require('express');
const asyncWrapper = require('../middleware/async');
const dbconnection = require('../utils/connection');
const moment = require('moment');

const dataProcess = asyncWrapper(async (req, res) => {
    const forms = req.body;
    let naoExiste = []; 
    let duplicadoMatricula = []
    let naoAtualizado = []
    for (let key in forms) {
        const matriculas = forms[key].nameList[0].split(',')
        const turno = forms[key].newTurn
        for(let i = 0; i < matriculas.length; i++){
            console.log(matriculas[i])
            try {
                const [rows] = await dbconnection.execute(
                  'SELECT id, name FROM users WHERE registration = ? AND deleted = 0 LIMIT 1',
                  [matriculas[i].trim()]
                );
                
                if (rows.length === 0) {
                  naoExiste.push(matriculas[i]); 
                  matriculas.splice(i, 1); 
                  i--; 
                } else {
                    naoAtualizado.push(await updateUsers(dbconnection, matriculas[i], turno, rows[0]['id']))
                }
              } catch (error) {
                res.status(500).json({ error: error.message });
                return;
              }
              
        }
        console.log(matriculas)
      }
  
    
    res.json({ Inexistente: naoExiste, NaoAtualizado: naoAtualizado, Duplicadas:duplicadoMatricula });
});

  



async function updateUsers(dbconnection, matricula, turno,id) {
    console.log(matricula, turno,id)
    const notUpdated = []
    const oldTurnList = []
    const turnIdList = []
    const [queryTurn] = await dbconnection.execute('SELECT id from groups WHERE NAME=?', [turno]);
    const turnNew = JSON.stringify(queryTurn[0]['id'])

    try{
        const [result] = await dbconnection.execute('select g.id,u.name from usergroups ug inner join groups g on g.id=ug.idGroup inner join users u on u.id=ug.idUser where u.deleted = 0 and g.idType = 1 and u.registration = ? and u.id = ? limit 1;', [matricula, id]);
        if (result[0]) {
            const turnOld = JSON.stringify(result[0]['id'])
            const nome = result[0]['name']
            oldTurnList.push(turnOld)
                if (turnOld != '1002') {
                    turnIdList.push(turnOld)
                    await dbconnection.execute('insert into usergroups(idUser, idGroup) values (?,?);', [id, turnNew])
                    console.log('inserido')
                    logInsert(dbconnection, matricula, turnOld, turnNew, id,nome)
                } else {
                    console.log('Mensalista: '+matricula)
                    return matricula;
                }
        } else {
            await dbconnection.execute('insert into usergroups(idUser, idGroup, isVisitor) values (?,?,0);', [id, turnNew])
        }
    } catch(error){
        console.log(error)
    }
}





async function logInsert(dbconnection, matricula, oldTurn, newTurn, id,nome) {
    console.log('Salvando no log....')
    const query = 'insert into DeleteQueue(comando,horarioExecucao,registration,oldTurn,newTurn,nome) values (?,?,?,?,?,?)';
    const proxDomingo = await getNextSunday()
    const queryCommand = `delete from usergroups where idUser = ${id} and idGroup = ${oldTurn}`
    console.log(proxDomingo)
    try {
        const [result] = await dbconnection.execute(query, [queryCommand, proxDomingo, matricula, oldTurn, newTurn,`${nome}`])
        console.log('Log cadastrado com sucesso!')
    } catch (error) {
        console.log(error)
    }
}



function removeNotUpdatedNames(userName, notUpdated) {
    console.log("removendo..." + userName, notUpdated)
    return userName.filter(name => !notUpdated.includes(name));
}

async function getNextSunday() {
    let now = moment();
    let nextSunday = now.day(7);
    nextSunday.hour(23).minute(59).second(0);
    let mysqlFormat = nextSunday.format('YYYY-MM-DD HH:mm:ss');
    return mysqlFormat;
}

module.exports = {
    dataProcess,
}
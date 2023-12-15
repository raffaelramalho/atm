const { json } = require('express');
const asyncWrapper = require('../middleware/async');
const dbconnection = require('../utils/connection');
const moment = require('moment');

const dataProcess = asyncWrapper(async (req, res) => {
  const forms = req.body;
  console.log(forms)
  let naoExiste = [];
  let duplicadoMatricula = [];
  let naoAtualizado = [];
  for (let key in forms) {
    const matriculas = forms[key].nameList[0].split(',');
    
    if (matriculas.length == '') {
      res.json({ error: 'Formulário em branco' });
      return;
    }
    const turno = forms[key].newTurn;
    if (turno == '') {
      res.json({ error: 'Turno em branco' });
      return;
    }
    const seenMatriculas = new Set();
    const matriculasParaAtualizar = [];
    for (let i = 0; i < matriculas.length; i++) {
      const matricula = matriculas[i].trim();
      console.log(matricula)
      if (seenMatriculas.has(matricula)) {
        duplicadoMatricula.push(matricula);
      } else {
        seenMatriculas.add(matricula);
        try {
          console.log('alterando....')
          const [rows] = await dbconnection.execute(
            'SELECT id, name FROM users WHERE registration = ? AND deleted = 0 and inativo = 0',
            [matricula]
          );
          if (rows.length === 0) {
            console.log('não existe')
            naoExiste.push(matricula);
          } else {
            matriculasParaAtualizar.push(matricula);
            naoAtualizado.push(await updateUsers(dbconnection, matricula, turno, rows[0]['id']));
          }
        } catch (error) {
          res.status(500).json({ error: error.message });
          return;
        }
      }
    }

    // Atualizar matriculas apenas com as não duplicadas
    forms[key].nameList[0] = matriculasParaAtualizar.join(',');

  }

  res.json({ Inexistente: naoExiste, NaoAtualizado: naoAtualizado, Duplicadas: duplicadoMatricula });
});







async function updateUsers(dbconnection, matricula, turno, id) {
 
  const notUpdated = []
  const oldTurnList = []
  const turnIdList = []
  const [queryTurn] = await dbconnection.execute('SELECT id from groups WHERE NAME=?', [turno]);
  const turnNew = JSON.stringify(queryTurn[0]['id'])

  try {
    const [result] = await dbconnection.execute('select g.id,u.name from usergroups ug inner join groups g on g.id=ug.idGroup inner join users u on u.id=ug.idUser where u.deleted = 0 and g.idType = 1 and u.registration = ? and u.id = ? limit 1;', [matricula, id]);
    console.log(result)
    if (result[0]) {
      const turnOld = JSON.stringify(result[0]['id'])
      console.log(turnOld)
      const nome = result[0]['name']
      oldTurnList.push(turnOld)
      if (turnOld != '1002') {
        turnIdList.push(turnOld)
        await dbconnection.execute('insert into usergroups(idUser, idGroup,isVisitor) values (?,?,0);', [id, turnNew])
    
        logInsert(dbconnection, matricula, turnOld, turnNew, id, nome)
      } else {
      
        return matricula;
      }
    } else {
      await dbconnection.execute('insert into usergroups(idUser, idGroup, isVisitor) values (?,?,0);', [id, turnNew])
    }
  } catch (error) {
    console.log(error)
  }
}





async function logInsert(dbconnection, matricula, oldTurn, newTurn, id, nome) {
  console.log('inserindo no log')
  const query = 'insert into DeleteQueue(comando,horarioExecucao,registration,oldTurn,newTurn,nome) values (?,?,?,?,?,?)';
  const proxDomingo = await getNextSunday()
  const queryCommand = `delete from usergroups where idUser = ${id} and idGroup = ${oldTurn}`
 
  try {
    const [result] = await dbconnection.execute(query, [queryCommand, proxDomingo, matricula, oldTurn, newTurn, `${nome}`])
  } catch (error) {
    console.log(error)
  }
  console.log('inserido com sucesso')
  return ''
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
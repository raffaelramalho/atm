const { json } = require('express');
const asyncWrapper = require('../middleware/async');
const dbconnection = require('../utils/connection');
const moment = require('moment');

const dataProcess = asyncWrapper(async (req, res) => {
  const forms = req.body;
  let naoExiste = [];
  let naoAtualizado = [];
  console.log(forms)
  for (let key in forms) {
    const matriculas = forms[key].nameList;
    const turno = forms[key].newTurn;

    if (turno == '') {
      res.json({ error: 'Turno em branco' });
      return;
    }

    const promises = matriculas.map(async (matricula) => {
      try {
        const [rows] = await dbconnection.execute(
          'SELECT id, name FROM users WHERE registration like ? AND deleted = 0 and inativo = 0',
          [matricula]
        );

        if (rows.length === 0) {
          naoExiste.push(matricula);
        } else {
          naoAtualizado.push(await updateUsers(dbconnection, matricula, turno, rows[0]['id']));
        }
      } catch (error) {
        console.log(error);
      }
    });

    await Promise.all(promises);
  }
  const formattedNaoAtualizado = naoAtualizado.filter((element) => element !== '' && element !== undefined && element !== null);
  res.json({ Inexistente: naoExiste, NaoAtualizado: formattedNaoAtualizado });
});




async function updateUsers(dbconnection, matricula, turno, id) {
 
  const notUpdated = []
  const oldTurnList = []
  const turnIdList = []
  const [queryTurn] = await dbconnection.execute('SELECT id from groups WHERE NAME=?', [turno]);
  const turnNew = JSON.stringify(queryTurn[0]['id'])

  try {
    const [isMensalista] = await dbconnection.execute('select g.id from users u inner join usergroups ug on u.id=ug.idUser inner join groups g on ug.idGroup=g.id where g.name = "Mensalistas" and u.registration= ? and u.deleted=0 and u.inativo=0;', [matricula]);
    const [result] = await dbconnection.execute('select g.id,u.name from usergroups ug inner join groups g on g.id=ug.idGroup inner join users u on u.id=ug.idUser where u.deleted = 0 and g.idType = 1 and u.registration = ? and u.id = ? limit 1;', [matricula, id]);
    if (result[0]) {
      const turnOld = JSON.stringify(result[0]['id'])
      const nome = result[0]['name']
      if(isMensalista[0]){
        console.log('é mensalista')
        return matricula
      } else {
        console.log('Inserindo no '+matricula+', lá ele')
        turnIdList.push(turnOld)
        await dbconnection.execute('insert into usergroups(idUser, idGroup,isVisitor) values (?,?,0);', [id, turnNew])
        await logInsert(dbconnection, matricula, turnOld, turnNew, id, nome)
      }
    } else {
        await dbconnection.execute('insert into usergroups(idUser, idGroup, isVisitor) values (?,?,0);', [id, turnNew])
    }
  } catch (error) {
    console.log(error)
  }

}





async function logInsert(dbconnection, matricula, oldTurn, newTurn, id, nome) {
  const query = 'insert into DeleteQueue(comando,horarioExecucao,registration,oldTurn,newTurn,status,nome) values (?,?,?,?,?,?,?)';
  const proxDomingo = await getNextSunday();
  const queryCommand = `delete from usergroups where idUser = ${id} and idGroup = ${oldTurn}`;
    try {
      const [result] = await dbconnection.execute(query, [queryCommand, proxDomingo, matricula, oldTurn, newTurn,'domingo', `${nome}`]);
      console.log('Inserido com sucesso');
    } catch (error) {
      console.log(error);
    }
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
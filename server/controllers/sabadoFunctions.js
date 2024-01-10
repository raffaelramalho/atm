const asyncWrapper = require('../middleware/async');
const dbconnection = require('../utils/connection');


const sabadoInsert =
    asyncWrapper(async (req, res) => {
        const request = req.body;
        const inexistente = []
        const rawArray = request[0]['nameList']
        const filteredArray = [...new Set(rawArray)]
        console.log(filteredArray)
        for( let matricula in filteredArray){
          try {
           const [resultSelect] = await dbconnection.execute(`Select id,name from users where registration = ? and deleted = 0 and inativo = 0`,[filteredArray[matricula]])
          if( resultSelect.length > 0 ){
            
            const [resultTurnId] = await dbconnection.execute(`select id from groups where name='Sábado Exceção'`)
            const id = resultTurnId[0]['id']
            const nameResult = resultSelect[0]['name']
            const registration = filteredArray[matricula]
            try {
              const [resultInsert] = await dbconnection.execute(`insert into usergroups(idUser,idGroup, isVisitor) values (?,?,0)`,[resultSelect[0].id, id])
              const deleteCommand = `delete from usergroups where idUser =${resultSelect[0].id} and idGroup = ${id}`
              const [deleteQueueInsert] = await dbconnection.execute(`insert into DeleteQueue(comando,status,nome,registration,newTurn) values(?,'sabado',?,?,?)`,[deleteCommand,nameResult,registration,id])
            }catch(error){
              console.log(error)
            }
          } else {
            inexistente.push(filteredArray[matricula])
          }
          } catch (error) {
            console.error(error);
          }
        }
        let responseList = filteredArray.filter(item => !inexistente.includes(item));
        return res.status(202).send({responseList,inexistente})
    })
module.exports = {
  sabadoInsert
}
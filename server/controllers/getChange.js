const asyncWrapper = require('../middleware/async');
const dbconnection = require('../utils/connection');


const logGetter = 
asyncWrapper( async (req,res) =>{
    const request = req.query;
    console.log(request)
    console.log('Enviando logs para o frontend');
    if('log' in request){
        const results = await dbconnection.execute(`SELECT d.nome,d.registration,d.oldTurn,d.newTurn,g.name FROM DeleteQueue d inner join groups g on d.newTurn=g.id`);
        return res.json([results]);
    } else if ('delete' in request){
        const matricula = request.delete
        console.log("Solicitação para deletar "+matricula)
        await deleteLine(matricula,dbconnection)
        return res.status(202)
    }
    return res.json('Erro :D')
})

const deleteLine = async(matricula,dbconnection) => {
    await deleteInsert(matricula,dbconnection)
    const query = `DELETE FROM DeleteQueue where registration =?`
    console.log(query,matricula)
    const [result] = await dbconnection.execute(query,[matricula]) 
    console.log('linha deletada com sucesso')
}

const deleteInsert = async(matricula, dbconnection)=>{
    console.log('Deletando novo insert.....')
    const query = `SELECT newTurn from DeleteQueue where registration=?`
    const [result] = await dbconnection.execute(query,[matricula])
    const newTurn = result[0]['newTurn'];
    const queryDelete = `delete from usergroups ug inner join users u on u.id=ug.idUser where u.registration = ? and ug.idGroup=? and u.deleted = 0 `
    const [resultFinal] = await dbconnection.execute(query,[matricula,newTurn])
    console.log('deletado com sucesso!')
}
module.exports = {
    logGetter,
}
const asyncWrapper = require('../middleware/async');
const dbconnection = require('../utils/connection');


const logGetter = 
asyncWrapper( async (req,res) =>{
    const request = req.query;
        if('log' in request){
        const results = await dbconnection.execute(`SELECT d.nome,d.registration,d.oldTurn,d.newTurn,g.name FROM DeleteQueue d inner join groups g on d.newTurn=g.id`);
        return res.json([results]);
    } else if ('delete' in request){
        const matricula = request.delete
        await deleteLine(matricula,dbconnection)
        return res.status(202)
    }
    return res.json('Erro :D')
})

const deleteLine = async(matricula,dbconnection) => {
    await deleteInsert(matricula,dbconnection)
    const query = `DELETE FROM DeleteQueue where registration =?`
    const [result] = await dbconnection.execute(query,[matricula]) 
}

const deleteInsert = async(matricula, dbconnection)=>{
    try {
        const query = `SELECT newTurn from DeleteQueue where registration=?`
        const [result] = await dbconnection.execute(query,[matricula])
        const newTurn = result[0]['newTurn'];
        const [getId] = await dbconnection.execute(`SELECT id FROM USERS WHERE registration=? AND DELETED = 0 AND INATIVO = 0`,[matricula])
        const id = getId[0]['id']
        const queryDelete = `DELETE FROM usergroups WHERE idUser =? AND idGroup = ?;`
        const [resultFinal] = await dbconnection.execute(queryDelete,[id,newTurn])
    } catch (error){
        console.log(error)
    }
}
module.exports = {
    logGetter,
}
const asyncWrapper = require('../middleware/async');
const dbconnection = require('../utils/connection');


const turnGetter = 
asyncWrapper( async (req,res) =>{
    const [results] = await dbconnection.execute(`SELECT * FROM groups WHERE idType = 1 AND NOT name LIKE 'Exceção%' and id < 1030 and id > 1 AND NOT name LIKE 'Mensalistas%'`);
    const turnos = results.map((result) => result.name);
    return res.json(turnos);
})


module.exports = {
    turnGetter
}
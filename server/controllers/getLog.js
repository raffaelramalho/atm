const asyncWrapper = require('../middleware/async');
const dbconnection = require('../utils/connection');


const logGetter = 
asyncWrapper( async (req,res) =>{
    console.log('Enviando logs para o frontend');
    const results = await dbconnection.execute(`SELECT * FROM excecao`);
    console.log(results)
    return res.json(results);
})


module.exports = {
    logGetter
}
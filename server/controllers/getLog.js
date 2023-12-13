const asyncWrapper = require('../middleware/async');
const dbconnection = require('../utils/connection');


const logGetter = 
asyncWrapper( async (req,res) =>{
    const results = await dbconnection.execute(`SELECT * FROM excecao`);
    return res.json(results);
})


module.exports = {
    logGetter,
}
const asyncWrapper = require('../middleware/async');
const dbconnection = require('../utils/connection');


const search = 
asyncWrapper( async (req,res) =>{
    console.log('Buscando por pessoas parecidas');
    const {username} = req.query;
    console.log(username)
    const query = `SELECT name,registration FROM users where name like ? and deleted = 0 and registration !='' limit 100`
    const [result] = await dbconnection.execute(query,[`${username}%`])
    console.log([result])
    return res.json([result]);
})


module.exports = {
    search
}
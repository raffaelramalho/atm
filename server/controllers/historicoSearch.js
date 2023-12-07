const asyncWrapper = require('../middleware/async');
const dbconnection = require('../utils/connection');


const searchGetter =
    asyncWrapper(async (req, res) => {
        console.log('Buscando por logs parecidas');
        const { username } = req.query;
        console.log(username)
        const query = `SELECT * FROM excecao WHERE (nomeLiberado like ? OR matriculaLiberado LIKE ?)`
        console.log(`SELECT * FROM excecao WHERE (nomeLiberado like ${username} OR matriculaLiberado LIKE ${username}) `)
        const [result] = await dbconnection.execute(query, [`%${username}%`,`%${username}%`])
        console.log([result])
        return res.json([result]);
    })

module.exports = {
    searchGetter
}
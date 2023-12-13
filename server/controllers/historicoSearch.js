const asyncWrapper = require('../middleware/async');
const dbconnection = require('../utils/connection');


const searchGetter =
    asyncWrapper(async (req, res) => {
        const { username } = req.query;
        const query = `SELECT * FROM excecao WHERE (nomeLiberado like ? OR matriculaLiberado LIKE ?)`
        const [result] = await dbconnection.execute(query, [`%${username}%`,`%${username}%`])
        return res.json([result]);
    })

module.exports = {
    searchGetter
}
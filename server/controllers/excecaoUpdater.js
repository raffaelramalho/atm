const asyncWrapper = require('../middleware/async');
const dbconnection = require('../utils/connection');


const search =
    asyncWrapper(async (req, res) => {
        const request = req.query;
        if ('registration' in request) {
            const { registration } = req.query;
            const query = `SELECT name,registration,isLeader FROM users where registration like ? and deleted = 0 limit 100`
            const [result] = await dbconnection.execute(query, [`%${registration}%`])
            return res.json([result]);
          } else {
            const { username } = req.query;
            const query = `SELECT name,registration,isLeader FROM users where name like ? and deleted = 0 and registration !='' limit 100`
            const [result] = await dbconnection.execute(query, [`%${username}%`])
            return res.json([result]);
          }
    })

module.exports = {
    search
}
const asyncWrapper = require('../middleware/async');
const dbconnection = require('../utils/connection');



const liberarGeral =
    asyncWrapper(async (req, res) => {
        //const  data  = req.body
        try {
          insereLiberacaoGeral()
          return res.status(200).json({msg:`Exceção adicionada com sucesso`})
        } catch(error) {
          return res.status(404).json({msg:`Não foi possível adicionar a exceção: `+error})
        }
        
    })
        
async function insereLiberacaoGeral() {
            try {
              const selectSql = `
                SELECT id
                FROM users
                WHERE deleted = 0 AND inativo = 0
              `;
              const [resultTurnId] = await dbconnection.execute(`select id from groups where name='FREEDOM_ IDSECUREPLUS _NAO_DELETAR'`) 
              const grupo = resultTurnId[0]['id']
              const [selectResults] = await dbconnection.execute(selectSql);
          
              const insertPromises = selectResults.map(async (user) => {
                const userId = user.id;
                const groupId = grupo; // ID do grupo que deseja inserir
                const isVisitor = 0; // Valor padrão, não é visitante
          
                const insertSql = `
                  INSERT INTO usergroups (idUser, idGroup, isVisitor)
                  VALUES (?, ?, ?)
                `;
          
                const [insertResult] = await dbconnection.execute(insertSql, [userId, groupId, isVisitor]);
                return insertResult;
              });
          
              await Promise.all(insertPromises);
          
              console.log(`Todos os usuários ativos foram inseridos com a liberação geral`);
              apagaLiberacaoGeral(grupo)
            } catch (error) {
              console.error('Erro ao inserir usuários ativos no grupo 2777:', error);
            }
          }


  function apagaLiberacaoGeral(id) {
    setTimeout( () => {
        try {
            const query = `delete from usergroups where idGroup = ?`
            dbconnection.execute(query,[id])
        } catch (error) {
            console.error('Erro ao deletar a linha:', error);
        }
    }, 15 * 60 * 1000); // 15 minutos em milissegundos
}



module.exports = {
    liberarGeral
}
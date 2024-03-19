const asyncWrapper = require('../middleware/async');
const dbconnection = require('../utils/connection');


const sabadoInsert =
    asyncWrapper(async (req, res) => {
      console.log("Começar o update para sábado....")
      const groupNames = ['SHE1_ IDSECUREPLUS _NAO_DELETAR', 'SHE2_ IDSECUREPLUS _NAO_DELETAR'];
      console.log(req.body)
      const requestData = req.body
      try {
        // Obter IDs dos Grupos
        const [sabadohe1, sabadohe2] = await Promise.all(groupNames.map(name => {
	 console.log(`select id from groups where name='${name}'`)
          return dbconnection.execute(`select id from groups where name='${name}'`);
        }));
        console.log(sabadohe1, sabadohe2)
        const sabado = sabadohe1[0][0]['id'];
        const sabado2 = sabadohe2[1][0]['id'];
    	console.log(sabado,sabado2)
        // Iterar sobre os objetos no array
        for (const data of requestData) {
	  console.log("minha data ===>")
	  console.log(data)
          const { nameList, newTurn } = data;
    
          // Para cada nome na lista, inserir na tabela usergroups
          for (const name of nameList) {
            const [resultSelect] = await dbconnection.execute(
              `SELECT id,name FROM users WHERE registration = ? AND deleted = 0 AND inativo = 0`,
              [name]
            );
    
            if (resultSelect.length > 0) {
              const userId = resultSelect[0].id;
              const userName = resultSelect[0].name
              const userMatricula = name
              // Inserir na tabela usergroups
              const [resultInsert] = await dbconnection.execute(
                `INSERT INTO usergroups (idUser, idGroup, isVisitor) VALUES (?, ?, 0)`,
                [userId, newTurn === 'sabadoHE1' ? sabado : sabado2]
              );
              const deleteCommand = `delete from usergroups where idUser =${userId} and idGroup = ${newTurn === 'sabadoHE1' ? sabado : sabado2}`
              const [deleteQueueInsert] = await dbconnection.execute(`insert into DeleteQueue(comando,status,nome,registration,newTurn) values(?,'sabado',?,?,?)`,[deleteCommand,userName,userMatricula,newTurn === 'sabadoHE1' ? sabado : sabado2])
              // Verificar se inserção foi bem-sucedida
              if (resultInsert.affectedRows === 1) {
                console.log(`Usuário com ID ${userId} inserido no grupo ${newTurn}`);
              } else {
                console.log(`Erro ao inserir usuário com ID ${userId} no grupo ${newTurn}`);
              }
            } else {
              console.log(`Usuário com nome ${name} não encontrado ou deletado/inativo`);
            }
          }
        }
    
        console.log('Processamento concluído.');
      } catch (error) {
        console.error('Erro durante o processamento:', error);
      }
    })

module.exports = {
  sabadoInsert
}
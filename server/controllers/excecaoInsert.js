const asyncWrapper = require('../middleware/async');
const dbconnection = require('../utils/connection');



const exception =
    asyncWrapper(async (req, res) => {
        console.log('Criando exceção...');
        const  data  = req.body
        const nameC = data.nameC
        const nameL = data.nameL
        const regC = data.regC
        const regL = data.regL
        const message = data.obs    
        if(await userExist(dbconnection, nameC, nameL,regC,regL)){
            console.log('Eles existem...')
            await userInsert(dbconnection, nameC,regC);
            await logInsert(dbconnection, nameC, regC,nameL, regL, message);
            return res.status(200).json({msg:`Exceção adicionada com sucesso`})
        } else {
            console.log('Alguma das partes não existe')
            return res.status(404).json({msg:`Não foi possível adicionar a exceção`})
        }
    })


async function userExist(dbconnection, nameC, nameL,regC,regL,idc) {
          console.log('Verificando se existe....')
          console.log(nameC,regC)
          console.log(nameL,regL)
          const query = `SELECT id FROM Users WHERE name = ? and registration = ? and deleted = 0 limit 1`;
          try {
            const results = await dbconnection.execute(query, [nameC,regC]);
            const results1 = await dbconnection.execute(query, [nameL,regL]);
            console.log(results[0].length)
            console.log(results1[0].length)
            if( results[0].length > 0 && results1.length > 0){
                return true
            } else {
                return false
            }
          } catch (error) {
            console.error('Erro durante a consulta ao banco de dados:', error);
            throw error;
          }
          
        }
        
async function userInsert(dbconnection, nameC, regC) {
          console.log('Adicionando exceção ao usuário....')
          const groupExc = 1126
          const query = `SELECT id FROM Users WHERE name = ? and registration = ? and deleted = 0 limit 1`;
          try {
            const results = await dbconnection.execute(query, [nameC,regC]);
            const queryInsert = `insert into usergroups(idUser,idGroup) values(?,?);`
            const insert = await dbconnection.execute(queryInsert, [results[0][0]['id'],groupExc])
            scheduleDeletion(results[0][0]['id'],groupExc, dbconnection)
          } catch (error) {
            console.error('Erro durante a consulta ao banco de dados:', error);
            throw error;
          }
          console.log('Adicionado com sucesso!')
        }   
     
    
//Fazer função de gravar no banco
async function  logInsert(dbconnection, nameC, regC,nameL, regL, message) {
    console.log('Salvando no log....')
    const current_datetime = new Date();
    const formatted_date = current_datetime.toISOString().slice(0, 19).replace('T', ' ');
    const query = `insert into excecao(nomeLiberado,matriculaLiberado,nomeRequerente,matriculaRequerente,dataLiberacao,duracao,observacao) values (?,?,?,?,?,?,?)`;
    try {
      const results = await dbconnection.execute(query, [nameC, regC,nameL, regL,formatted_date, 30, message]);
      
    } catch (error) {
      console.error('Erro durante ao inserir ao banco de dados:', error);
      throw error;
    }
    console.log('Log cadastrado com sucesso!')
  }   

  function scheduleDeletion(id,grupo, dbconnection) {
    console.log('Marcando a exclusão da exceção');
    setTimeout(async () => {
        try {
            const query = `delete from usergroups where idUser = ? and idGroup = ?`
            await dbconnection.execute(query,[])
            console.log('Linha deletada com sucesso!');
        } catch (error) {
            console.error('Erro ao deletar a linha:', error);
        }
    }, 30 * 60 * 1000); // 30 minutos em milissegundos
}

// Chame a função para agendar a exclusão
scheduleDeletion();


module.exports = {
    exception
}
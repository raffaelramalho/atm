const asyncWrapper = require('../middleware/async');
const dbconnection = require('../utils/connection');



const exception =
    asyncWrapper(async (req, res) => {
        const  data  = req.body
        const nameC = data.nameC
        const nameL = data.nameL
        const regC = data.regC
        const regL = data.regL
        const message = data.obs    
        if(await userExist(dbconnection, nameC, nameL,regC,regL)){
            await userInsert(dbconnection, nameC,regC);
            await logInsert(dbconnection, nameC, regC,nameL, regL, message);
            return res.status(200).json({msg:`Exceção adicionada com sucesso`})
        } else {
            return res.status(404).json({msg:`Não foi possível adicionar a exceção`})
        }
    })


async function userExist(dbconnection, nameC, nameL,regC,regL,idc) {
          const query = `SELECT id FROM Users WHERE name = ? and registration = ? and deleted = 0 limit 1`;
          const query1 = `SELECT id FROM Users WHERE name = ? and registration = ? and deleted = 0 and comments = 'Autoriza Entrada' limit 1`;
          try {
            const results = await dbconnection.execute(query, [nameC,regC]);
            const results1 = await dbconnection.execute(query1, [nameL,regL]);  
            if( results[0].length > 0 && results1[0].length > 0){
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
          //ABAIXO É O NOME DO CAMPO PARA FAZER A EXCEÇÃO NO CONTROL ID
          const [resultTurnId] = await dbconnection.execute(`select id from groups where name='Exceção - ID SECURE PLUS - NÃO DELETAR'`) 
          const groupExc = resultTurnId[0]['id']
          const query = `SELECT id FROM Users WHERE name = ? and registration = ? and deleted = 0 limit 1`;
          try {
            const results = await dbconnection.execute(query, [nameC,regC]);
            const queryInsert = `insert into usergroups(idUser,idGroup) values(?,?);`
            const insert = await dbconnection.execute(queryInsert, [results[0][0]['id'],groupExc])
            const id = results[0][0]['id']; 
            scheduleDeletion(id,groupExc, dbconnection)
          } catch (error) {
            console.error('Erro durante a consulta ao banco de dados:', error);
            throw error;
          }
        }   
     
    

async function  logInsert(dbconnection, nameC, regC,nameL, regL, message) {
    const current_datetime = new Date();
    let day = current_datetime.getDate();
    let month = current_datetime.getMonth() + 1; 
    let year = current_datetime.getFullYear();
    let hours = current_datetime.getHours();
    let minutes = current_datetime.getMinutes();
    let seconds = current_datetime.getSeconds();
    day = (day < 10) ? '0' + day : day;
    month = (month < 10) ? '0' + month : month;
    hours = (hours < 10) ? '0' + hours : hours;
    minutes = (minutes < 10) ? '0' + minutes : minutes;
    seconds = (seconds < 10) ? '0' + seconds : seconds;
    const formatted_date = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
    const query = `insert into excecao(nomeLiberado,matriculaLiberado,nomeRequerente,matriculaRequerente,dataLiberacao,duracao,observacao) values (?,?,?,?,?,?,?)`;
    try {
      const results = await dbconnection.execute(query, [nameC, regC,nameL, regL,formatted_date, 5, message]);
      
    } catch (error) {
      throw error;
    }
  }   

  function scheduleDeletion(id,grupo, dbconnection) {
    setTimeout(async () => {
        try {
            const query = `delete from usergroups where idUser = ? and idGroup = ?`
            await dbconnection.execute(query,[id,grupo])
        } catch (error) {
            console.error('Erro ao deletar a linha:', error);
        }
    }, 5 * 60 * 1000); // 5 minutos em milissegundos
}



module.exports = {
    exception
}
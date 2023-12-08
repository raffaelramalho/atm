const asyncWrapper = require('../middleware/async');
const dbconnection = require('../utils/connection');


const dataProcess = asyncWrapper (async (req,res) =>{
    const userNameList = req.body.nameList;
    const turn = req.body.newTurn;  
    if (!userNameList || userNameList.length === 0) {
        return res.status(400).send('A lista de nomes não pode estar vazia.');
    }
    const { userMatricula, 
            userName, 
            userId, 
            userInvalid 
          } = await userExist(dbconnection, userNameList);
            console.log(userId , userMatricula, userName,userInvalid)
    
    const { notUpdated,turnIdList } = await updateUsers(dbconnection, userMatricula, userName, userId, turn);
    
    const updatedUserName = removeNotUpdatedNames(userName, notUpdated);
    scheduleDeletion(dbconnection,userId,turnIdList)
    return res.send({ 
            matricula:userMatricula, 
            nome:updatedUserName, 
            id:userId, 
            invalido:userInvalid,
            naoAtualizado: notUpdated   });
})


async function userExist(dbconnection, userNameList) {
            const userMatricula = []
            const userName = []
            const userId = []
            const userInvalid  = []
            
            for (let nome of userNameList) {
              const query = `SELECT registration,id FROM Users WHERE name = ? and deleted = 0 limit 1`;
              try {
                const [results] = await dbconnection.execute(query, [nome]);
                if( results.length > 0){
                    console.log("Resultados"+ JSON.stringify([results]))
                    const matricula = [results][0][0]['registration'];
                    const id = [results][0][0]['id']
                    userMatricula.push(matricula)
                    userId.push(id)
                    userName.push(nome)
                } else {
                    if (nome !== ''){
                        userInvalid.push(nome)
                    }
                }
              } catch (error) {
                console.error('Erro durante a consulta ao banco de dados:', error);
                throw error;
              }
            }
            
            return { userId, userName, userMatricula, userInvalid };
          }


async function updateUsers(dbconnection, userMatricula, userName, userId, turn){
            console.log('Atualizando usuários')
            const notUpdated = []
            const oldTurnList = []
            const turnIdList = []
            const queryTurn = await dbconnection.execute(`SELECT id from groups WHERE NAME='${turn}'`);
            console.log('ID do turno obtido com sucesso')
            const turnNew = JSON.stringify([queryTurn][0][0][0]['id'])
            console.log('TURNO: '+turnNew)
            for (let i = 0; i < userId.length; i++){
                console.log('Verificando id: '+userId[i])
                const query = `select g.id from usergroups ug inner join groups g on g.id=ug.idGroup inner join users u on u.id=ug.idUser where u.deleted = 0 and g.idType = 1 and u.registration = ? and u.id = ? limit 1;`;
                const [result] = await dbconnection.execute(query, [userMatricula[i], userId[i]]);
                if(result[0]){
                    const turnOld = JSON.stringify(result[0]['id'])
                    oldTurnList.push(turnOld)
                    console.log(turnOld)
                    if(turnOld == '1002' ){
                        console.log(userName[i]+' é mensalista e não foi alterado')
                        notUpdated.push(userName[i])
                    } else {
                        turnIdList.push(turnOld)
                        const updateQuery = `UPDATE  usergroups u INNER JOIN groups g ON u.idGroup = g.id SET idGroup =? WHERE g.idType = 1 AND idUser = ?;`
                        const update = await dbconnection.execute(updateQuery,[ turnNew, userId[i]])
                        console.log(userName[i]+' foi atualizado com sucesso')
                    }
                } else{
                    console.log(userName[i]+' não possui grupo');
                    const insertQuery = `insert into usergroups(idUser, idGroup, isVisitor) values (?,?,0);`
                    const insert = await dbconnection.execute(insertQuery,[userId[i], turnNew])
                    console.log('Inserido com sucesso!')
                }
            }
            return { notUpdated, turnIdList };
}



async function  logInsert(dbconnection, nameC, regC,nameL, regL, message) {
    console.log('Salvando no log....')
    
    const query = `insert into excecao(nomeLiberado,matriculaLiberado,nomeRequerente,matriculaRequerente,dataLiberacao,duracao,observacao) values (?,?,?,?,?,?,?)`;

    try {
      const results = await dbconnection.execute(query, [nameC, regC,nameL, regL,formatted_date, 30, message]);
      
    } catch (error) {
      console.error('Erro durante ao inserir ao banco de dados:', error);
      throw error;
    }
    console.log('Log cadastrado com sucesso!')
  } 

async function scheduleDeletion(dbconnection, id,grupo ) {
    console.log('Marcando a exclusão da exceção');
    const deleteId = id
    const deleteGrupo = grupo
    setTimeout(async () => {
        try {
            for(let i =0; i<id.length; i++){
                const query = `delete from usergroups where idUser = ? and idGroup = ?`
                console.log(`delete from usergroups where idUser = ${id[i]} and idGroup = ${grupo[i]}`)
                await dbconnection.execute(query,[id[i],grupo[i]])
                console.log('Linha deletada com sucesso!');
            }
        } catch (error) {
            console.error('Erro ao deletar a linha:', error);
        }
    }, 30 * 1000); // 60* 30 * 1000
}


function removeNotUpdatedNames(userName, notUpdated) {
    return userName.filter(name => !notUpdated.includes(name));
}



module.exports = {
    dataProcess,
}
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require("express");
const dbconnection = require('./utils/connection');
const errorHandlerMiddleware = require('./middleware/error-handler');
const notFound = require('./middleware/not-found');
const PORT = process.env.PORT || 3307;
const app = express();

//rotas
const loginValidation = require('./routes/userLogin')
const turnGetter = require('./routes/appController');
const dataProcess = require('./routes/userController');
const feriasProcess = require('./routes/feriasController');
const excecaoController = require('./routes/excecaoController');
const excecaoInsert = require('./routes/excecaoInsertController')
const logController = require('./routes/historicoController')
const logSearcher = require('./routes/historicoSearchController')
const changeLog = require('./routes/changeController')
const sabado = require('./routes/sabadoInsertController')
const liberdade = require('./routes/liberaGeralController')

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(cors());

const rota = '/api/v1/'
app.use(`${rota}loginValidate/`, loginValidation);
app.use(`${rota}getTurn/`, turnGetter)
app.use(`${rota}getLog/`, logController)
app.use(`${rota}searchGetter`, logSearcher)
app.use(`${rota}processar-dados/`, dataProcess)
app.use(`${rota}processar-ferias/`, feriasProcess)
app.use(`${rota}search`, excecaoController)
app.use(`${rota}exception`, excecaoInsert)
app.use(`${rota}dashboard`, logSearcher)
app.use(`${rota}changeLog`,changeLog)
app.use(`${rota}sabado`,sabado)
app.use(`${rota}liberaGeral`,liberdade)

const start = async () => {
    try {
        dbconnection.getConnection()
        app.listen(PORT, '10.0.1.204')
    } catch (error) {
     
    }
}



app.use(notFound);
app.use(errorHandlerMiddleware);
start()
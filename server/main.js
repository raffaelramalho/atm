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
const  turnGetter   = require('./routes/appController');
const  dataProcess  = require('./routes/userController');


app.use(bodyParser.json()); // Para interpretar corpos de requisição em JSON
app.use(bodyParser.urlencoded({ extended: true })); // Para interpretar dados de formulário
app.use(cors());
app.options('*', cors());


//Uso de Rotas
const rota ='/api/v1/'
app.use(`${rota}loginValidate/`, loginValidation);
app.use(`${rota}getTurn/`, turnGetter);
app.use(`${rota}processar-dados/`, dataProcess)

app.get(`${rota}teste/`, (req, res) => {res.json({"message": "Hello world!"});})

const start = async () => {
    try {
        dbconnection.getConnection()
        app.listen(PORT,'10.0.1.204', console.log(`URL: 10.0.1.204:${PORT}`))
    } catch(error) {
        console.log(error)
    }
}



app.use(notFound);
app.use(errorHandlerMiddleware);
start()
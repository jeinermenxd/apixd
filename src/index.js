
/* Importación del módulo express. */
const express = require('express');
/* Un middleware que nos permite realizar peticiones desde el frontend al backend. */
const cors = require('cors');
/* Creación de una instancia de la aplicación express. */
const app = express();
/* Importación del archivo index.controllers.js. */
const indexControllers = require('./controllers/index.controlles');

// Politcas CORS
app.use(cors());


//añadir nombre del puerto en este caso es el Fly ----- o el localthost
require('dotenv').config();

/* Obtener el puerto de la variable de entorno. */
const port = process.env.PORT;

//middlewars
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const cookieParser = require('cookie-parser');
// app.use(cookieParser());
// app.use(indexControllers.verifyToken);


//cors
app.use(cors({
    origin: true,
    methods: ['GET', 'POST']
}));


//Login and register
app.route('/register')
    .post(indexControllers.setRegister);

app.route('/login')
    .post(indexControllers.setLogin);



app.use('/usuario', require('./routers/indexU'));


app.use('/roles', require('./routers/roles.router'));
app.use('/planes', require('./routers/planes.router'));
app.use('/ciudad', require('./routers/ciudad.router'));
app.use('/parroquia', require('./routers/parroquia.router'));
app.use('/canton', require('./routers/canton.router'));
app.use('/persona', require('./routers/persona.router'));
app.use('/user', require('./routers/user.router'));
app.use('/contrato', require('./routers/contrato.router'));
app.use('/anexo1', require('./routers/anexo1.router'));
app.use('/anexo2', require('./routers/anexo2.router'));
app.use('/contrasena', require('./routers/contrasena.router'));
app.use('/filtro', require('./routers/filtro.router'));

/* Escuchando el puerto e imprimiendo un mensaje a la consola. */
app.listen(port);
console.log('INICIO DE SERVER EXITOSO', port, '!!');
//--------------------------------------------------------CONEXION A POSTGRES--------------------------------------------------------------///
/* Importando el objeto Pool desde el módulo pg. */
const { Pool } = require('pg')

/* Cargando el archivo .env y almacenando los valores en el objeto process.env. */
require('dotenv').config()
/* El código anterior está creando un nuevo conjunto de conexiones a la base de datos. */
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT
})
/* El código anterior se está conectando a la base de datos. */
pool.connect()
    .then(() => console.log("Conexion Exitosa!!"));
    
module.exports=pool;

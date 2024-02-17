/* Esta es una tarea de desestructuración. Es una expresión de JavaScript que hace posible descomprimir
valores de matrices o propiedades de objetos en distintas variables. */
const {Router}= require('express');
const router = Router();

/* Importando las funciones desde el archivo index.controllers.js. */
const { getUsuario }=require('../controllers/index.controlles');
const { getUsuarioById }=require('../controllers/index.controlles');
const { createUsuario }=require('../controllers/index.controlles');
const { updateUsuario}=require('../controllers/index.controlles');
const { deleteUsuario}=require('../controllers/index.controlles');


/* El código anterior crea un objeto de enrutador y luego usa el objeto de enrutador para crear rutas
para la API. */
router.get('/',getUsuario);
router.get('/:id', getUsuarioById);
router.post('/', createUsuario);
router.put('/:id', updateUsuario);
router.delete('/:id', deleteUsuario);

/* Exportando el objeto del enrutador. */
module.exports=router;
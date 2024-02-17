/* Esta es una tarea de desestructuración. Es una expresión de JavaScript que hace posible descomprimir
valores de matrices o propiedades de objetos en distintas variables. */
const {Router}= require('express');
const router = Router();


const {
    getRoles,
    getRolesById,
    createRoles,
    updateRoles,
    deleteRol
} = require('../controllers/tabla_rol');


/* El código anterior crea un objeto de enrutador y luego usa el objeto de enrutador para crear rutas
para la API. */
router.get('/',getRoles);
router.get('/:id', getRolesById);
router.post('/', createRoles);
router.put('/:id', updateRoles);
router.delete('/:id', deleteRol);

/* Exportando el objeto del enrutador. */
module.exports=router;
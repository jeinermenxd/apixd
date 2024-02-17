const { Router } = require('express');
const router = Router();

const {
    getUsuarios,
    getUsuarioById,
    getUsuarioByIdPersona,
    createUsuario,
    updateUsuario,
    updateRegister,
    deleteUsuario
} = require('../controllers/tabla_usuario');

router.get('/', getUsuarios);
router.get('/:id', getUsuarioById);
router.get('/persona/:id', getUsuarioByIdPersona);
router.post('/', createUsuario);
router.put('/', updateRegister);
router.delete('/:id', deleteUsuario);

module.exports = router;

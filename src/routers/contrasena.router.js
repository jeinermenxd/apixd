const { Router } = require('express');
const router = Router();

const {
    recuperarContrasena,
    cambiarContrasena,
    validaCodigo
} = require('../controllers/recuperacioncontrasena');


router.post('/recuperar-contrasena/', recuperarContrasena);
router.post('/validacodigo/', validaCodigo);
router.post('/cambiar-contrasena/', cambiarContrasena);

module.exports = router;

const { Router } = require('express');
const router = Router();

const {
    filtroCantonCiudad,
    filtroCiudadParroquia
} = require('../controllers/filtros.controlles');


router.post('/filtroCiudades/', filtroCantonCiudad);
router.post('/filtroParroquias/', filtroCiudadParroquia);
module.exports = router;

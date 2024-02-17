const { Router } = require('express');
const router = Router();

const {
    getCiudades,
    getCiudadById,
    createCiudad,
    updateCiudad,
    deleteCiudad,
    createCiudadIDCanton
    
} = require('../controllers/tabla_ciudad');

router.get('/', getCiudades);
router.get('/:id', getCiudadById);
router.post('/', createCiudad);
router.put('/:id', updateCiudad);
router.delete('/:id', deleteCiudad);
router.post('/:id', createCiudadIDCanton);

module.exports = router;

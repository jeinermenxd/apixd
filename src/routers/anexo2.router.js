const { Router } = require('express');
const router = Router();

const {
    getAnexos2,
    getAnexo2ById,
    createAnexo2,
    updateAnexo2,
    deleteAnexo2
} = require('../controllers/tabla_anexo2');

router.get('/', getAnexos2);
router.get('/:id', getAnexo2ById);
router.post('/', createAnexo2);
router.put('/:id', updateAnexo2);
router.delete('/:id', deleteAnexo2);

module.exports = router;

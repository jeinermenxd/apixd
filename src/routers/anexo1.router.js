const { Router } = require('express');
const router = Router();

const {
    getAnexos1,
    getAnexo1ById,
    createAnexo1,
    updateAnexo1,
    deleteAnexo1
} = require('../controllers/tabla_anexo1');

router.get('/', getAnexos1);
router.get('/:id', getAnexo1ById);
router.post('/', createAnexo1);
router.put('/:id', updateAnexo1);
router.delete('/:id', deleteAnexo1);

module.exports = router;

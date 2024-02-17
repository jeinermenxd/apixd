const { Router } = require('express');
const router = Router();

const {
    getContratos,
    getContratoById,
    getinfoContratoById,
    createContrato,
    updateContrato,
    deleteContrato
} = require('../controllers/tabla_contrato');

router.get('/', getContratos);
router.get('/:id', getContratoById);
router.get('/info/:id', getinfoContratoById);
router.post('/', createContrato);
router.put('/', updateContrato);
router.delete('/:id', deleteContrato);

module.exports = router;

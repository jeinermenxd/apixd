const { Router } = require('express');
const router = Router();

const {
    getCantones,
    getCantonById,
    createCanton,
    updateCanton,
    deleteCanton
} = require('../controllers/tabla_canton');

router.get('/', getCantones);
router.get('/:id', getCantonById);
router.post('/', createCanton);
router.put('/:id', updateCanton);
router.delete('/:id', deleteCanton);

module.exports = router;

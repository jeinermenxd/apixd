const { Router } = require('express');
const router = Router();

const {
    getParroquias,
    getParroquiaById,
    createParroquia,
    updateParroquia,
    deleteParroquia
} = require('../controllers/tabla_parroquia');

router.get('/', getParroquias);
router.get('/:id', getParroquiaById);
router.post('/', createParroquia);
router.put('/:id', updateParroquia);
router.delete('/:id', deleteParroquia);

module.exports = router;

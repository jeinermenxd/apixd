const { Router } = require('express');
const router = Router();

const {
    getPlanes,
    getPlanById,
    createPlan,
    updatePlan,
    deletePlan
} = require('../controllers/tabla_planes');

/* El código anterior crea un objeto de enrutador y luego usa el objeto de enrutador para crear rutas
para la API. */
router.get('/', getPlanes);
router.get('/:id', getPlanById);
router.post('/', createPlan);
router.put('/:id', updatePlan);
router.delete('/:id', deletePlan);

/* Exportando el objeto del enrutador. */
module.exports = router;

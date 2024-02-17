const { Router } = require('express');
const router = Router();

const {
    getPersonas,
    getPersonaById,
    getPersonaByDNI,
    createPersona,
    updatePersona,
    deletePersona
} = require('../controllers/tabla_persona');

router.get('/', getPersonas);
router.get('/:id', getPersonaById);
router.get('/dni/:id', getPersonaByDNI);
router.post('/', createPersona);
router.put('/:id', updatePersona);
router.delete('/:id', deletePersona);

module.exports = router;

const express = require('express');
const router = express.Router();
const marcaController = require('../controllers/marcaController');
const autenticar = require('../middlewares/auth');
const { checkRole } = require('../middlewares/rules');

router.get('/carrossel', marcaController.carrossel);
router.get('/', marcaController.listartodos);
router.get('/:id', marcaController.buscarPorId);
router.post('/', autenticar, checkRole('admin'), marcaController.criar);
router.delete('/:id', autenticar, checkRole('admin'), marcaController.deletar);

module.exports = router;
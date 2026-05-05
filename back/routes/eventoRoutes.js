const express = require('express');
const router = express.Router();
const eventoController = require('../controllers/eventoController');
const autenticar = require('../middlewares/auth');
const { checkRole } = require('../middlewares/rules');

router.get('/carrossel', eventoController.carrossel);
router.get('/:id', eventoController.buscarPorId);
router.post('/', autenticar, checkRole('admin'), eventoController.criar);
router.put('/:id', autenticar, checkRole('admin'), eventoController.atualizar);
router.delete('/:id', autenticar, checkRole('admin'), eventoController.deletar);

module.exports = router;
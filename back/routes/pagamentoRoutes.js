const express = require('express');
const router = express.Router();
const pagamentoController = require('../controllers/pagamentoController');
const autenticar = require('../middlewares/auth');
const { checkRole } = require('../middlewares/rules');

router.get('/', autenticar, pagamentoController.listar);
router.get('/pedido/:pedido_id', autenticar, pagamentoController.buscarPorPedido);
router.put('/:id/status', autenticar, checkRole('admin'), pagamentoController.atualizarStatus);

module.exports = router;
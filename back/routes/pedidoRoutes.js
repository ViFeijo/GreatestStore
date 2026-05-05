const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');
const autenticar = require('../middlewares/auth');

router.post('/', autenticar, pedidoController.criar);
router.get('/', autenticar, pedidoController.listar);
router.get('/:id', autenticar, pedidoController.buscarPorId);

module.exports = router;

const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');
const autenticar = require('../middlewares/auth');
const { checkRole } = require('../middlewares/rules');

router.get('/', produtoController.listartodos);
router.get('/buscar', produtoController.buscarPorModelo);
router.get('/meus', autenticar, checkRole('vendedor'), produtoController.meusProdutos);
router.get('/:id', produtoController.buscarPorId);
router.post('/', autenticar, checkRole('vendedor'), produtoController.criar);
router.put('/:id', autenticar, checkRole('vendedor'), produtoController.atualizar);
router.delete('/:id', autenticar, checkRole('vendedor', 'admin'), produtoController.deletar);

module.exports = router;
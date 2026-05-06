const express = require('express');
const router = express.Router();
const subcategoriaController = require('../controllers/subcategoriaController');
const autenticar = require('../middlewares/auth');
const { checkRole } = require('../middlewares/rules');

router.get('/', subcategoriaController.listartodos);
router.get('/categoria/:categoria_id', subcategoriaController.listarPorCategoria);
router.get('/:id', subcategoriaController.buscarPorId);
router.post('/', autenticar, checkRole('admin'), subcategoriaController.criar);
router.put('/:id', autenticar, checkRole('admin'), subcategoriaController.atualizar);
router.delete('/:id', autenticar, checkRole('admin'), subcategoriaController.deletar);

module.exports = router;
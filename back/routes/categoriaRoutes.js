const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');
const autenticar = require('../middlewares/auth');
const { checkRole } = require('../middlewares/rules');

router.get('/', categoriaController.listartodos);
router.get('/:id', categoriaController.buscarPorId);
router.post('/', autenticar, checkRole('admin'), categoriaController.criar);
router.put('/:id', autenticar, checkRole('admin'), categoriaController.atualizar);
router.delete('/:id', autenticar, checkRole('admin'), categoriaController.deletar);

module.exports = router;
const express = require('express');
const router = express.Router();
const vendedorController = require('../controllers/vendedorController');
const autenticar = require('../middlewares/auth');
const { checkRole } = require('../middlewares/rules');

router.get('/perfil', autenticar, checkRole('vendedor'), vendedorController.perfil);
router.put('/perfil/completar', autenticar, checkRole('vendedor'), vendedorController.completarPerfil);
router.put('/perfil', autenticar, checkRole('vendedor'), vendedorController.atualizar);
router.delete('/perfil', autenticar, checkRole('vendedor'), vendedorController.deletar);
router.get('/todos', autenticar, checkRole('admin'), vendedorController.listartodos);

module.exports = router;
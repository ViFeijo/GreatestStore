const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const autenticar = require('../middlewares/auth');
const { checkRole } = require('../middlewares/rules');

router.get('/perfil', autenticar, usuarioController.perfil);
router.put('/perfil', autenticar, usuarioController.atualizar);
router.delete('/perfil', autenticar, usuarioController.deletar);
router.get('/todos', autenticar, checkRole('admin'), usuarioController.listarTodos);
router.delete('/:id', autenticar, checkRole('admin'), usuarioController.deletarPorId);

module.exports = router;
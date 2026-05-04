const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const autenticar = require('../middlewares/auth');
const { checkRole } = require('../middlewares/rules');

router.post('/registrar', usuarioController.registrar);
router.post('/login', usuarioController.login);
router.get('/perfil', autenticar, usuarioController.perfil);
router.put('/perfil', autenticar, usuarioController.atualizar);
router.delete('/perfil', autenticar, usuarioController.deletar);
router.get('/todos', autenticar, checkRole('admin'), usuarioController.listarTodos);

module.exports = router;
const router = require('express').Router();
const usuarioController = require('../controllers/usuariocontroller');
const adminController = require('../controllers/admincontroller'); // Se existir
const { verifyToken } = require('../middlewares/auth');
const { checkRole } = require('../middlewares/rules');

router.use(verifyToken, checkRole('admin'));
router.get('/usuarios', usuarioController.listartodos);
router.delete('/usuarios/:id', usuarioController.deletar);
router.get('/dashboard-geral', adminController.relatorioGeral);

module.exports = router;
const router = require('express').Router();
const vendedorController = require('../controllers/vendedorcontroller');
const { verifyToken } = require('../middlewares/auth');
const { checkRole }   = require('../middlewares/rules');

router.post('/', vendedorController.criar);
router.post('/registrar', vendedorController.registrar);
router.post('/meus-produtos', verifyToken, checkRole('vendedor'), produtoController.criar);
router.get('/dashboard', verifyToken, checkRole('vendedor'), vendedorController.dashboard);
router.get('/', vendedorController.listartodos);
router.get('/:id', vendedorController.buscarPorId);
router.put('/:id', verifyToken, checkRole('admin'), vendedorController.atualizar);
router.delete('/:id', verifyToken, checkRole('admin'), vendedorController.deletar);

module.exports = router;
const router = require('express').Router();
const produtoController = require('../controllers/produtocontroller');
const { verifyToken } = require('../middlewares/auth');
const { checkRole } = require('../middlewares/rules');

router.get('/', produtoController.listartodos);
router.get('/:id', produtoController.buscarPorId);

router.post('/', verifyToken, checkRole('vendedor'), produtoController.criar);
router.put('/:id', verifyToken, checkRole('vendedor'), produtoController.atualizar);
router.delete('/:id', verifyToken, checkRole('vendedor'), produtoController.deletar);

module.exports = router;
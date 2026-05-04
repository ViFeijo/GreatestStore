const router = require('express').Router();
const usuarioController = require('../controllers/usuariocontroller');
const { verifyToken } = require('../middlewares/auth');
const { checkRole } = require('../middlewares/rules');

router.post('/', usuarioController.criar);
router.post('/login', usuarioController.login);
router.get('/', verifyToken, checkRole('admin'), usuarioController.listartodos);
router.get('/:id', verifyToken, usuarioController.buscarPorId);
router.get('/:id/carrinho', verifyToken, usuarioController.verCarrinho);
router.post('/:id/carrinho', verifyToken, usuarioController.adicionarCarrinho);
router.put('/:id', verifyToken, usuarioController.atualizar);
router.delete('/:id', verifyToken, checkRole('admin'), usuarioController.deletar);

module.exports = router;
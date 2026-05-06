const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');
const autenticar = require('../middlewares/auth');
const { checkRole } = require('../middlewares/rules');

router.get('/filtrar', produtoController.buscarComFiltros);
router.get('/subcategoria/:subcategoria_id', produtoController.buscarPorSubcategoria);
router.get('/filtrar', produtoController.buscarComFiltros);
router.get('/carrossel', produtoController.carrossel);
router.get('/carrossel/oferta', produtoController.carrosselOferta);
router.get('/carrossel/random', produtoController.carrosselRandom);
router.get('/carrossel/favoritos', autenticar, produtoController.carrosselFavoritos);
router.get('/carrossel/categoria/:categoria_id', produtoController.carrosselCategoria);
router.get('/carrossel/evento/:evento_id', produtoController.carrosselEvento);
router.get('/buscar', produtoController.buscar);
router.get('/meus', autenticar, checkRole('vendedor'), produtoController.meusProdutos);
router.get('/', produtoController.listartodos);
router.get('/:id', produtoController.buscarPorId);
router.post('/', autenticar, checkRole('vendedor'), produtoController.criar);
router.put('/:id', autenticar, checkRole('vendedor'), produtoController.atualizar);
router.delete('/:id', autenticar, checkRole('vendedor', 'admin'), produtoController.deletar);

module.exports = router;
const express = require('express');
const router = express.Router();
const favoritosController = require('../controllers/favoritosController');
const autenticar = require('../middlewares/auth');

router.get('/', autenticar, favoritosController.listar);
router.post('/:produto_id', autenticar, favoritosController.adicionar);
router.get('/:produto_id', autenticar, favoritosController.verificar);
router.delete('/:produto_id', autenticar, favoritosController.remover);

module.exports = router;
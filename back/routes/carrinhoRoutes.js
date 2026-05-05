const express = require('express');
const router = express.Router();
const carrinhoController = require('../controllers/carrinhoController');
const autenticar = require('../middlewares/auth');

router.post('/', autenticar, carrinhoController.adicionar);
router.get('/', autenticar, carrinhoController.listar);
router.put('/:id', autenticar, carrinhoController.atualizar);
router.delete('/:id', autenticar, carrinhoController.remover);

module.exports = router;
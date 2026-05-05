const express = require('express');
const router = express.Router();
const enderecoController = require('../controllers/enderecoController');
const autenticar = require('../middlewares/auth');

router.post('/', autenticar, enderecoController.criar);
router.get('/', autenticar, enderecoController.listar);
router.put('/:id/principal', autenticar, enderecoController.definirPrincipal);
router.put('/:id', autenticar, enderecoController.atualizar);
router.delete('/:id', autenticar, enderecoController.deletar);

module.exports = router;
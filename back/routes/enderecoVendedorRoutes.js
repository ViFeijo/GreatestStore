const express = require('express');
const router = express.Router();
const enderecoVendedorController = require('../controllers/enderecoVendedorController');
const autenticar = require('../middlewares/auth');
const { checkRole } = require('../middlewares/rules');

router.post('/', autenticar, checkRole('vendedor'), enderecoVendedorController.criar);
router.get('/', autenticar, checkRole('vendedor'), enderecoVendedorController.buscar);
router.put('/', autenticar, checkRole('vendedor'), enderecoVendedorController.atualizar);
router.delete('/', autenticar, checkRole('vendedor'), enderecoVendedorController.deletar);

module.exports = router;
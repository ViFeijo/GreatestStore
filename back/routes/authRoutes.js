const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/registrar/cliente', authController.registrarCliente);
router.post('/registrar/vendedor', authController.registrarVendedor);
router.post('/login', authController.login);

module.exports = router;
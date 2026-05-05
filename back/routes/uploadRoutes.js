const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const autenticar = require('../middlewares/auth');
const { checkRole } = require('../middlewares/rules');
const upload = require('../config/upload');

router.post('/produto/:produto_id', autenticar, checkRole('vendedor'), upload.single('imagem'), uploadController.uploadProduto);
router.post('/vendedor/perfil', autenticar, checkRole('vendedor'), upload.single('imagem'), uploadController.uploadVendedorPerfil);
router.post('/vendedor/banner', autenticar, checkRole('vendedor'), upload.single('imagem'), uploadController.uploadVendedorBanner);
router.post('/marca/:marca_id', autenticar, checkRole('admin'), upload.single('imagem'), uploadController.uploadMarca);
router.post('/evento/:evento_id', autenticar, checkRole('admin'), upload.single('imagem'), uploadController.uploadEvento);

module.exports = router;
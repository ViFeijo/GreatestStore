const express = require('express');
const router = express.Router();
const notificacaoController = require('../controllers/notificacaoController');
const autenticar = require('../middlewares/auth');

router.get('/', autenticar, notificacaoController.listar);
router.get('/nao-lidas', autenticar, notificacaoController.contarNaoLidas);
router.put('/todas', autenticar, notificacaoController.marcarTodasComoLidas);
router.put('/:id', autenticar, notificacaoController.marcarComoLida);
router.delete('/:id', autenticar, notificacaoController.deletar);

module.exports = router;
const express = require('express');
const router = express.Router();
const avaliacaoController = require('../controllers/avaliacaoController');
const autenticar = require('../middlewares/auth');

router.get('/produto/:produto_id', avaliacaoController.listar);
router.post('/produto/:produto_id', autenticar, avaliacaoController.criar);
router.put('/:id', autenticar, avaliacaoController.atualizar);
router.delete('/:id', autenticar, avaliacaoController.deletar);

module.exports = router;
const service = require('../services/produtoService');

async function criar(req, res) {
  try {
    const novo = await service.criar(req.body);
    res.status(201).json(novo);
  } catch (error) {
    res.status(400).json({ erro: 'Erro ao criar produto. Verifique os dados enviados.' });
  }
}


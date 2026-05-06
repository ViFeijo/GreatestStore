const Favoritos = require('../models/favoritosModel');

async function adicionar(req, res) {
  try {
    const { produto_id } = req.params;

    const jaFavoritado = await Favoritos.verificar(req.usuarioId, produto_id);
    if (jaFavoritado) {
      return res.status(409).json({ error: 'Produto já está nos favoritos' });
    }

    const favorito = await Favoritos.adicionar(req.usuarioId, produto_id);
    return res.status(201).json(favorito);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function listar(req, res) {
  try {
    const favoritos = await Favoritos.listar(req.usuarioId);
    return res.json(favoritos);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function verificar(req, res) {
  try {
    const { produto_id } = req.params;
    const favorito = await Favoritos.verificar(req.usuarioId, produto_id);
    return res.json({ favoritado: !!favorito });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function remover(req, res) {
  try {
    const { produto_id } = req.params;
    const favorito = await Favoritos.remover(req.usuarioId, produto_id);
    if (!favorito) {
      return res.status(404).json({ error: 'Favorito não encontrado' });
    }
    return res.json({ mensagem: 'Produto removido dos favoritos' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

module.exports = { adicionar, listar, verificar, remover };
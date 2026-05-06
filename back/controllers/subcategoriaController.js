const Subcategoria = require('../models/subcategoriaModel');

async function criar(req, res) {
  try {
    const { categoria_id, nome } = req.body;
    if (!categoria_id || !nome) {
      return res.status(400).json({ error: 'Categoria e nome são obrigatórios' });
    }

    const subcategoria = await Subcategoria.criar(categoria_id, nome);
    return res.status(201).json(subcategoria);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function listartodos(req, res) {
  try {
    const subcategorias = await Subcategoria.listartodos();
    return res.json(subcategorias);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function listarPorCategoria(req, res) {
  try {
    const subcategorias = await Subcategoria.listarPorCategoria(req.params.categoria_id);
    return res.json(subcategorias);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function buscarPorId(req, res) {
  try {
    const subcategoria = await Subcategoria.buscarPorId(req.params.id);
    if (!subcategoria) {
      return res.status(404).json({ error: 'Subcategoria não encontrada' });
    }
    return res.json(subcategoria);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function atualizar(req, res) {
  try {
    const { nome } = req.body;
    const subcategoria = await Subcategoria.atualizar(req.params.id, nome);
    if (!subcategoria) {
      return res.status(404).json({ error: 'Subcategoria não encontrada' });
    }
    return res.json(subcategoria);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function deletar(req, res) {
  try {
    const subcategoria = await Subcategoria.deletar(req.params.id);
    if (!subcategoria) {
      return res.status(404).json({ error: 'Subcategoria não encontrada' });
    }
    return res.json({ mensagem: 'Subcategoria deletada com sucesso' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

module.exports = { criar, listartodos, listarPorCategoria, buscarPorId, atualizar, deletar };
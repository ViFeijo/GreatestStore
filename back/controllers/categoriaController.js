const Categoria = require('../models/categoriaModel');

async function criar(req, res) {
  try {
    const { nome } = req.body;
    if (!nome) return res.status(400).json({ error: 'Nome é obrigatório' });

    const categoria = await Categoria.criar(nome);
    return res.status(201).json(categoria);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function listartodos(req, res) {
  try {
    const categorias = await Categoria.listartodos();
    return res.json(categorias);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function buscarPorId(req, res) {
  try {
    const categoria = await Categoria.buscarPorId(req.params.id);
    if (!categoria) return res.status(404).json({ error: 'Categoria não encontrada' });
    return res.json(categoria);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function atualizar(req, res) {
  try {
    const { nome } = req.body;
    const categoria = await Categoria.atualizar(req.params.id, nome);
    if (!categoria) return res.status(404).json({ error: 'Categoria não encontrada' });
    return res.json(categoria);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function deletar(req, res) {
  try {
    const categoria = await Categoria.deletar(req.params.id);
    if (!categoria) return res.status(404).json({ error: 'Categoria não encontrada' });
    return res.json({ mensagem: 'Categoria deletada com sucesso' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

module.exports = { criar, listartodos, buscarPorId, atualizar, deletar };
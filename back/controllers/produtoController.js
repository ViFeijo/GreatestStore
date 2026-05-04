const Produto = require('../models/produtoModel');

async function criar(req, res) {
  try {
    const novo = await Produto.criar(req.body);
    return res.status(201).json(novo);
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
}

async function listartodos(req, res) {
  try {
    const produtos = await Produto.listartodos();
    return res.json(produtos);
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
}

async function buscarPorId(req, res) {
  try {
    const produto = await Produto.buscarPorId(req.params.id);
    if (!produto) return res.status(404).json({ erro: 'Produto não encontrado' });
    return res.json(produto);
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
}

async function atualizar(req, res) {
  try {
    const produto = await Produto.atualizar(req.params.id, req.body);
    if (!produto) return res.status(404).json({ erro: 'Produto não encontrado' });
    return res.json(produto);
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
}

async function deletar(req, res) {
  try {
    const ok = await Produto.deletar(req.params.id);
    if (!ok) return res.status(404).json({ erro: 'Produto não encontrado' });
    return res.json({ mensagem: 'Produto deletado com sucesso' });
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
}

module.exports = { criar, listartodos, buscarPorId, atualizar, deletar };
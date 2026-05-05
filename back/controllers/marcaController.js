const Marca = require('../models/marcaModel');

async function carrossel(req, res) {
  try {
    const marcas = await Marca.buscarParaCarrossel();
    return res.json(marcas);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function listartodos(req, res) {
  try {
    const marcas = await Marca.listartodos();
    return res.json(marcas);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function buscarPorId(req, res) {
  try {
    const marca = await Marca.buscarPorId(req.params.id);
    if (!marca) return res.status(404).json({ error: 'Marca não encontrada' });
    return res.json(marca);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function criar(req, res) {
  try {
    const { nome } = req.body;
    if (!nome) return res.status(400).json({ error: 'Nome é obrigatório' });
    const marca = await Marca.criar(nome);
    return res.status(201).json(marca);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function deletar(req, res) {
  try {
    const marca = await Marca.deletar(req.params.id);
    if (!marca) return res.status(404).json({ error: 'Marca não encontrada' });
    return res.json({ mensagem: 'Marca deletada com sucesso' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

module.exports = { carrossel, listartodos, buscarPorId, criar, deletar };
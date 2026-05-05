const Endereco = require('../models/enderecoModel');

async function criar(req, res) {
  try {
    const endereco = await Endereco.criar(req.usuarioId, req.body);
    return res.status(201).json(endereco);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function listar(req, res) {
  try {
    const enderecos = await Endereco.listarPorUsuario(req.usuarioId);
    return res.json(enderecos);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function definirPrincipal(req, res) {
  try {
    const endereco = await Endereco.definirPrincipal(req.params.id, req.usuarioId);
    if (!endereco) return res.status(404).json({ error: 'Endereço não encontrado' });
    return res.json(endereco);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function atualizar(req, res) {
  try {
    const endereco = await Endereco.atualizar(req.params.id, req.body);
    if (!endereco) return res.status(404).json({ error: 'Endereço não encontrado' });
    return res.json(endereco);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function deletar(req, res) {
  try {
    const endereco = await Endereco.deletar(req.params.id);
    if (!endereco) return res.status(404).json({ error: 'Endereço não encontrado' });
    return res.json({ mensagem: 'Endereço deletado com sucesso' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

module.exports = { criar, listar, definirPrincipal, atualizar, deletar };
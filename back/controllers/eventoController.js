const Evento = require('../models/eventoModel');

async function carrossel(req, res) {
  try {
    const eventos = await Evento.buscarAtivos();
    return res.json(eventos);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function buscarPorId(req, res) {
  try {
    const evento = await Evento.buscarPorId(req.params.id);
    if (!evento) return res.status(404).json({ error: 'Evento não encontrado' });
    return res.json(evento);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function criar(req, res) {
  try {
    const { nome, descricao, data_inicio, data_fim } = req.body;
    if (!nome || !data_inicio || !data_fim) {
      return res.status(400).json({ error: 'Nome, data início e data fim são obrigatórios' });
    }
    const evento = await Evento.criar(req.body);
    return res.status(201).json(evento);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function atualizar(req, res) {
  try {
    const evento = await Evento.atualizar(req.params.id, req.body);
    if (!evento) return res.status(404).json({ error: 'Evento não encontrado' });
    return res.json(evento);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function deletar(req, res) {
  try {
    const evento = await Evento.deletar(req.params.id);
    if (!evento) return res.status(404).json({ error: 'Evento não encontrado' });
    return res.json({ mensagem: 'Evento deletado com sucesso' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

module.exports = { carrossel, buscarPorId, criar, atualizar, deletar };
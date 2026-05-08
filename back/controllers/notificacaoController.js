const Notificacao = require('../models/notificacaoModel');

async function listar(req, res) {
  try {
    const notificacoes = await Notificacao.listarPorUsuario(req.usuarioId);
    return res.json(notificacoes);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function contarNaoLidas(req, res) {
  try {
    const total = await Notificacao.contarNaoLidas(req.usuarioId);
    return res.json({ total });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function marcarComoLida(req, res) {
  try {
    const notificacao = await Notificacao.marcarComoLida(req.params.id, req.usuarioId);
    if (!notificacao) {
      return res.status(404).json({ error: 'Notificação não encontrada' });
    }
    return res.json(notificacao);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function marcarTodasComoLidas(req, res) {
  try {
    await Notificacao.marcarTodasComoLidas(req.usuarioId);
    return res.json({ mensagem: 'Todas notificações marcadas como lidas' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function deletar(req, res) {
  try {
    const notificacao = await Notificacao.deletar(req.params.id, req.usuarioId);
    if (!notificacao) {
      return res.status(404).json({ error: 'Notificação não encontrada' });
    }
    return res.json({ mensagem: 'Notificação deletada' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

module.exports = { listar, contarNaoLidas, marcarComoLida, marcarTodasComoLidas, deletar };
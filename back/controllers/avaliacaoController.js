const Avaliacao = require('../models/avaliacaoModel');

async function criar(req, res) {
  try {
    const { produto_id } = req.params;
    const { nota, comentario } = req.body;

    if (!nota || nota < 1 || nota > 5 || (nota * 2) % 1 !== 0) {
      return res.status(400).json({ error: 'Nota deve ser entre 1 e 5 com incremento de 0.5 (ex: 1, 1.5, 2, 2.5...)' });
    }

    const jaAvaliou = await Avaliacao.buscarPorUsuarioEProduto(req.usuarioId, produto_id);
    if (jaAvaliou) {
      return res.status(409).json({ error: 'Você já avaliou este produto' });
    }

    const avaliacao = await Avaliacao.criar(produto_id, req.usuarioId, nota, comentario);
    return res.status(201).json(avaliacao);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function listar(req, res) {
  try {
    const { produto_id } = req.params;
    const avaliacoes = await Avaliacao.listarPorProduto(produto_id);
    const media = await Avaliacao.mediaPorProduto(produto_id);
    return res.json({ media, avaliacoes });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function atualizar(req, res) {
  try {
    const { nota, comentario } = req.body;

    if (!nota || nota < 1 || nota > 5 || (nota * 2) % 1 !== 0) {
      return res.status(400).json({ error: 'Nota deve ser entre 1 e 5 com incremento de 0.5 (ex: 1, 1.5, 2, 2.5...)' });
    }

    const avaliacao = await Avaliacao.atualizar(req.params.id, nota, comentario);
    if (!avaliacao) return res.status(404).json({ error: 'Avaliação não encontrada' });
    return res.json(avaliacao);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function deletar(req, res) {
  try {
    const avaliacao = await Avaliacao.deletar(req.params.id, req.usuarioId);
    if (!avaliacao) return res.status(404).json({ error: 'Avaliação não encontrada' });
    return res.json({ mensagem: 'Avaliação deletada com sucesso' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

module.exports = { criar, listar, atualizar, deletar };
const Carrinho = require('../models/carrinhoModel');
const Endereco = require('../models/enderecoModel');
const { calcularFrete } = require('../utils/calcularFrete');

async function adicionar(req, res) {
  try {
    const { produto_id, quantidade } = req.body;

    if (!produto_id || !quantidade || quantidade < 1) {
      return res.status(400).json({ error: 'Produto e quantidade são obrigatórios' });
    }

    const item = await Carrinho.adicionar(req.usuarioId, produto_id, quantidade);
    return res.status(201).json(item);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function listar(req, res) {
  try {
    const { endereco_id } = req.query;
    const itens = await Carrinho.listar(req.usuarioId);

    if (!itens.length) {
      return res.json({ itens: [], subtotal: 0, frete: 0, total: 0 });
    }

    const subtotal = itens.reduce((acc, item) => acc + parseFloat(item.subtotal_item), 0);

    let frete = 0;
    if (endereco_id) {
      const endereco = await Endereco.buscarPorId(endereco_id);
      if (endereco && itens[0].cep_vendedor) {
        frete = calcularFrete(itens[0].cep_vendedor, endereco.cep);
      }
    }

    const total = subtotal + frete;

    return res.json({
      itens,
      subtotal: subtotal.toFixed(2),
      frete: frete.toFixed(2),
      total: total.toFixed(2)
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function atualizar(req, res) {
  try {
    const { quantidade } = req.body;

    if (!quantidade || quantidade < 1) {
      return res.status(400).json({ error: 'Quantidade inválida' });
    }

    const item = await Carrinho.atualizar(req.params.id, req.usuarioId, quantidade);
    if (!item) return res.status(404).json({ error: 'Item não encontrado no carrinho' });
    return res.json(item);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function remover(req, res) {
  try {
    const item = await Carrinho.remover(req.params.id, req.usuarioId);
    if (!item) return res.status(404).json({ error: 'Item não encontrado no carrinho' });
    return res.json({ mensagem: 'Item removido do carrinho' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

module.exports = { adicionar, listar, atualizar, remover };
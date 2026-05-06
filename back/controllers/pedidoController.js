const Pedido = require('../models/pedidoModel');
const Carrinho = require('../models/carrinhoModel');
const Endereco = require('../models/enderecoModel');
const { calcularFrete } = require('../utils/calcularFrete');
const Pagamento = require('../models/pagamentoModel');

async function criar(req, res) {
  try {
    const { endereco_id, metodo_pagamento } = req.body;

    if (!endereco_id || !metodo_pagamento) {
      return res.status(400).json({ error: 'Endereço e método de pagamento são obrigatórios' });
    }

    const itens = await Carrinho.listar(req.usuarioId);
    if (!itens.length) {
      return res.status(400).json({ error: 'Carrinho vazio' });
    }

    const endereco = await Endereco.buscarPorId(endereco_id);
    if (!endereco) {
      return res.status(404).json({ error: 'Endereço não encontrado' });
    }

    const subtotal = itens.reduce((acc, item) => acc + parseFloat(item.subtotal_item), 0);
    const frete = itens[0].cep_vendedor ? calcularFrete(itens[0].cep_vendedor, endereco.cep) : 0;
    const total = subtotal + frete;

    const pedido = await Pedido.criar(req.usuarioId, endereco_id, total);

    const itensPedido = itens.map(item => ({
      produto_id: item.produto_id,
      quantidade: item.quantidade,
      preco_unitario: item.preco_final
    }));

    await Pedido.adicionarItens(pedido.id, itensPedido);
    const pagamento = await Pagamento.criar(pedido.id, metodo_pagamento, total);
    await Carrinho.limpar(req.usuarioId);

    return res.status(201).json({
      pedido,
      pagamento_id: pagamento.id,
      subtotal: subtotal.toFixed(2),
      frete: frete.toFixed(2),
      total: total.toFixed(2),
      metodo_pagamento
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function listar(req, res) {
  try {
    const pedidos = await Pedido.listarPorUsuario(req.usuarioId);
    return res.json(pedidos);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function buscarPorId(req, res) {
  try {
    const pedido = await Pedido.buscarPorId(req.params.id);
    if (!pedido) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }
    return res.json(pedido);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

module.exports = { criar, listar, buscarPorId };
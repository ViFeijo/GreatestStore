const Pagamento = require('../models/pagamentoModel');
const Pedido = require('../models/pedidoModel');

async function buscarPorPedido(req, res) {
  try {
    const pagamento = await Pagamento.buscarPorPedido(req.params.pedido_id);
    if (!pagamento) {
      return res.status(404).json({ error: 'Pagamento não encontrado' });
    }
    return res.json(pagamento);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function listar(req, res) {
  try {
    const pagamentos = await Pagamento.listarPorUsuario(req.usuarioId);
    return res.json(pagamentos);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function atualizarStatus(req, res) {
  try {
    const { status, codigo_transacao } = req.body;

    const statusValidos = ['pendente', 'aprovado', 'recusado', 'estornado'];
    if (!statusValidos.includes(status)) {
      return res.status(400).json({ error: 'Status inválido' });
    }

    const pagamento = await Pagamento.atualizarStatus(req.params.id, status, codigo_transacao);
    if (!pagamento) return res.status(404).json({ error: 'Pagamento não encontrado' });

    if (status === 'aprovado') {
      await Pedido.atualizarStatus(pagamento.pedido_id, 'pago');
    }

    if (status === 'recusado' || status === 'estornado') {
      await Pedido.atualizarStatus(pagamento.pedido_id, 'cancelado');
    }

    return res.json(pagamento);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

module.exports = { buscarPorPedido, listar, atualizarStatus };
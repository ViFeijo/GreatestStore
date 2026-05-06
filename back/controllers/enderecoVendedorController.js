const EnderecoVendedor = require('../models/enderecoVendedorModel');
const Vendedor = require('../models/vendedorModel');

async function criar(req, res) {
  try {
    const vendedor = await Vendedor.buscarPorUsuarioId(req.usuarioId);
    if (!vendedor) return res.status(404).json({ error: 'Vendedor não encontrado' });

    const { cep, rua, numero, bairro, cidade, estado } = req.body;
    if (!cep || !rua || !numero || !bairro || !cidade || !estado) {
      return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos' });
    }

    const enderecoExistente = await EnderecoVendedor.buscarPorVendedor(vendedor.id);
    if (enderecoExistente) {
      return res.status(409).json({ error: 'Endereço já cadastrado, use o método de atualizar' });
    }

    const endereco = await EnderecoVendedor.criar(vendedor.id, req.body);
    return res.status(201).json(endereco);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function buscar(req, res) {
  try {
    const vendedor = await Vendedor.buscarPorUsuarioId(req.usuarioId);
    if (!vendedor) return res.status(404).json({ error: 'Vendedor não encontrado' });

    const endereco = await EnderecoVendedor.buscarPorVendedor(vendedor.id);
    if (!endereco) return res.status(404).json({ error: 'Endereço não cadastrado' });
    return res.json(endereco);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function atualizar(req, res) {
  try {
    const vendedor = await Vendedor.buscarPorUsuarioId(req.usuarioId);
    if (!vendedor) return res.status(404).json({ error: 'Vendedor não encontrado' });

    const endereco = await EnderecoVendedor.atualizar(vendedor.id, req.body);
    if (!endereco) return res.status(404).json({ error: 'Endereço não encontrado' });
    return res.json(endereco);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function deletar(req, res) {
  try {
    const vendedor = await Vendedor.buscarPorUsuarioId(req.usuarioId);
    if (!vendedor) return res.status(404).json({ error: 'Vendedor não encontrado' });

    const endereco = await EnderecoVendedor.deletar(vendedor.id);
    if (!endereco) return res.status(404).json({ error: 'Endereço não encontrado' });
    return res.json({ mensagem: 'Endereço deletado com sucesso' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

module.exports = { criar, buscar, atualizar, deletar };
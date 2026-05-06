const Vendedor = require('../models/vendedorModel');

async function perfil(req, res) {
  try {
    const vendedor = await Vendedor.buscarPorUsuarioId(req.usuarioId);
    if (!vendedor) {
      return res.status(404).json({ error: 'Vendedor não encontrado' });
    }
    return res.json(vendedor);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function completarPerfil(req, res) {
  try {
    const { nome_fantasia, razao_social } = req.body;

    if (!nome_fantasia || !razao_social) {
      return res.status(400).json({ error: 'Nome fantasia e razão social são obrigatórios' });
    }

    const vendedor = await Vendedor.completarPerfil(req.usuarioId, nome_fantasia, razao_social);
    if (!vendedor) {
      return res.status(404).json({ error: 'Vendedor não encontrado' });
    }
    return res.json(vendedor);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function atualizar(req, res) {
  try {
    const vendedor = await Vendedor.atualizar(req.usuarioId, req.body);
    if (!vendedor) {
      return res.status(404).json({ error: 'Vendedor não encontrado' });
    }
    return res.json(vendedor);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function listartodos(req, res) {
  try {
    const vendedores = await Vendedor.listartodos();
    return res.json(vendedores);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function deletar(req, res) {
  try {
    const vendedor = await Vendedor.deletar(req.usuarioId);
    if (!vendedor) {
      return res.status(404).json({ error: 'Vendedor não encontrado' });
    }
    return res.json({ mensagem: 'Vendedor deletado com sucesso' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

module.exports = { perfil, completarPerfil, atualizar, listartodos, deletar };
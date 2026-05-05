const Produto = require('../models/produtoModel');
const Vendedor = require('../models/vendedorModel');
const Marca = require('../models/marcaModel');

async function criar(req, res) {
  try {
    const vendedor = await Vendedor.buscarPorUsuarioId(req.usuarioId);
    if (!vendedor) return res.status(404).json({ error: 'Vendedor não encontrado' });

    let marca_id = req.body.marca_id || null;

    if (req.body.marca_nome && !marca_id) {
      let marca = await Marca.buscarPorNome(req.body.marca_nome);
      if (!marca) marca = await Marca.criar(req.body.marca_nome);
      marca_id = marca.id;
    }

    const produto = await Produto.criar({
      ...req.body,
      vendedor_id: vendedor.id,
      marca_id
    });

    return res.status(201).json(produto);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function listartodos(req, res) {
  try {
    const produtos = await Produto.listartodos();
    return res.json(produtos);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function buscarPorId(req, res) {
  try {
    const produto = await Produto.buscarPorId(req.params.id);
    if (!produto) return res.status(404).json({ error: 'Produto não encontrado' });

    const imagens = await Produto.buscarImagensPorId(req.params.id);
    return res.json({ ...produto, imagens });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function buscar(req, res) {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Termo de busca é obrigatório' });

    const produtos = await Produto.buscarFuzzy(q);
    return res.json(produtos);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function buscarPorModelo(req, res) {
  try {
    const { modelo } = req.query;
    if (!modelo) return res.status(400).json({ error: 'Modelo é obrigatório' });

    const produtos = await Produto.buscarPorModelo(modelo);
    return res.json(produtos);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function meusProdutos(req, res) {
  try {
    const vendedor = await Vendedor.buscarPorUsuarioId(req.usuarioId);
    if (!vendedor) return res.status(404).json({ error: 'Vendedor não encontrado' });

    const produtos = await Produto.buscarPorVendedor(vendedor.id);
    return res.json(produtos);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function carrossel(req, res) {
  try {
    const produtos = await Produto.buscarParaCarrossel();
    return res.json(produtos);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function carrosselCategoria(req, res) {
  try {
    const { categoria_id } = req.params;
    const produtos = await Produto.buscarPorCategoria(categoria_id);
    return res.json(produtos);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function carrosselOferta(req, res) {
  try {
    const produtos = await Produto.buscarEmOferta();
    return res.json(produtos);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function carrosselRandom(req, res) {
  try {
    const produtos = await Produto.buscarRandom();
    return res.json(produtos);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function carrosselFavoritos(req, res) {
  try {
    const produtos = await Produto.buscarFavoritos(req.usuarioId);
    return res.json(produtos);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function carrosselEvento(req, res) {
  try {
    const { evento_id } = req.params;
    const produtos = await Produto.buscarPorEvento(evento_id);
    return res.json(produtos);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function atualizar(req, res) {
  try {
    const vendedor = await Vendedor.buscarPorUsuarioId(req.usuarioId);
    if (!vendedor) return res.status(404).json({ error: 'Vendedor não encontrado' });

    const produto = await Produto.buscarPorId(req.params.id);
    if (!produto) return res.status(404).json({ error: 'Produto não encontrado' });

    if (produto.vendedor_id !== vendedor.id) {
      return res.status(403).json({ error: 'Você não tem permissão para editar este produto' });
    }

    let marca_id = req.body.marca_id || produto.marca_id;

    if (req.body.marca_nome) {
      let marca = await Marca.buscarPorNome(req.body.marca_nome);
      if (!marca) marca = await Marca.criar(req.body.marca_nome);
      marca_id = marca.id;
    }

    const atualizado = await Produto.atualizar(req.params.id, { ...req.body, marca_id });
    return res.json(atualizado);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function deletar(req, res) {
  try {
    const produto = await Produto.buscarPorId(req.params.id);
    if (!produto) return res.status(404).json({ error: 'Produto não encontrado' });

    if (req.user.role !== 'admin') {
      const vendedor = await Vendedor.buscarPorUsuarioId(req.usuarioId);
      if (!vendedor || produto.vendedor_id !== vendedor.id) {
        return res.status(403).json({ error: 'Você não tem permissão para deletar este produto' });
      }
    }

    await Produto.deletar(req.params.id);
    return res.json({ mensagem: 'Produto deletado com sucesso' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

module.exports = { 
  criar, listartodos, buscarPorId, buscarPorModelo, buscar, meusProdutos,
  carrossel, carrosselCategoria, carrosselOferta, carrosselRandom,
  carrosselFavoritos, carrosselEvento, atualizar, deletar
};
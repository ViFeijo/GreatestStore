const service = require('../services/usuarioservice');

async function criar(req, res) {
  try {
    const { nome, email, senha } = req.body;
    const novo = await service.criar(nome, email, senha);
    res.status(201).json(novo);
  } catch (error) {
    res.status(400).json({ erro: 'Erro ao criar usuário. Verifique se o e-mail já existe.' });
  }
}

async function listartodos(req, res) {
  try {
    const usuarios = await service.listartodos();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ erro: 'Erro interno no servidor' });
  }
}

async function buscarPorId(req, res) {
  try {
    const idSolicitado = Number(req.params.id);
    const usuarioLogado = req.usuario; // Garanta que no verifyToken você usou req.usuario

    if (usuarioLogado.id !== idSolicitado && usuarioLogado.role !== 'admin') {
      return res.status(403).json({ erro: 'Acesso negado: você não pode ver os dados de outro usuário' });
    }

    const usuario = await service.buscarPorId(idSolicitado);  
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    const { senha, ...semSenha } = usuario;
    res.json(semSenha);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar usuário' });
  }
}

async function atualizar(req, res) {
  try {
    const id = Number(req.params.id);
    const usuarioLogado = req.usuario;
    if (usuarioLogado.id !== id && usuarioLogado.role !== 'admin') {
      return res.status(403).json({ erro: 'Acesso negado' });
    }

    const atualizado = await service.atualizar(id, req.body);
    if (!atualizado) {
      return res.status(404).json({ erro: 'Não encontrado' });
    }
    res.json(atualizado);
  } catch (error) {
    res.status(400).json({ erro: 'Erro ao atualizar dados' });
  }
}

async function deletar(req, res) {
  try {
    const ok = await service.deletar(Number(req.params.id));
    if (!ok) {
      return res.status(404).json({ erro: 'Não encontrado' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao deletar usuário' });
  }
}

async function login(req, res) {
  try {
    const { email, senha } = req.body;
    const resultado = await service.login(email, senha);
    
    if (!resultado) {
      return res.status(401).json({ erro: 'E-mail ou senha inválidos' });
    }
    
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao processar login' });
  }
}

module.exports = { criar, listartodos, buscarPorId, atualizar, deletar, login };
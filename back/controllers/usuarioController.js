const bcrypt = require('bcrypt');
const Usuario = require('../models/usuarioModel');

async function registrar(req, res) {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
    }

    const usuarioExistente = await Usuario.buscarPorEmail(email);
    if (usuarioExistente) {
      return res.status(409).json({ error: 'Email já cadastrado' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    const usuario = await Usuario.criar(nome, email, senhaHash, 'cliente');

    return res.status(201).json(usuario);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function perfil(req, res) {
  try {
    const usuario = await Usuario.buscarPorId(req.usuarioId);
    if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });
    return res.json(usuario);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function atualizar(req, res) {
  try {
    const { nome, email } = req.body;
    const usuario = await Usuario.atualizar(req.usuarioId, nome, email);
    if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });
    return res.json(usuario);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function deletar(req, res) {
  try {
    const usuario = await Usuario.deletar(req.usuarioId);
    if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });
    return res.json({ mensagem: 'Conta deletada com sucesso' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function listarTodos(req, res) {
  try {
    const usuarios = await Usuario.buscarTodos();
    return res.json(usuarios);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

module.exports = { registrar, perfil, atualizar, deletar, listarTodos };  
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuarioModel');

async function registrar(req, res) {
  try {
    const { nome, email, senha, role } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
    }

    const usuarioExistente = await Usuario.buscarPorEmail(email);
    if (usuarioExistente) {
      return res.status(409).json({ error: 'Email já cadastrado' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    const usuario = await Usuario.criar(nome, email, senhaHash, role);

    return res.status(201).json(usuario);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function login(req, res) {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const usuario = await Usuario.buscarPorEmail(email);
    if (!usuario) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, role: usuario.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role
      }
    });
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

module.exports = { registrar, login, perfil, atualizar, deletar, listarTodos };
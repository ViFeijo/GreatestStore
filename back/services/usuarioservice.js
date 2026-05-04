const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const model = require('../models/usuarioModel');

async function criar(nome, email, senha) {
  const hash = await bcrypt.hash(senha, 10);
  const usuario = await model.salvar({ nome, email, senha: hash });
  return { id: usuario.id, nome: usuario.nome, email: usuario.email };
}

async function listartodos() {
  const usuarios = await model.buscarTodos();
  return usuarios.map(({ senha, ...resto }) => resto);
}

async function buscarPorId(id) {
  return await model.buscarPorId(id);
}

async function atualizar(id, dados) {
  if (dados.senha) {
    dados.senha = await bcrypt.hash(dados.senha, 10);
  }
  const atualizado = await model.atualizar(id, dados);
  if (!atualizado) return null;
  const { senha, ...semSenha } = atualizado;
  return semSenha;
}

async function deletar(id) {
  const usuario = await model.buscarPorId(id);
  if (!usuario) return false;
  await model.deletar(id);
  return true;
}

async function login(email, senha) {
  const usuario = await model.buscarPorEmail(email);
  if (!usuario) return null;
  const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
  if (!senhaCorreta) return null;

  const token = jwt.sign(
    { id: usuario.id, email: usuario.email, role: usuario.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  return { token };
}

module.exports = { criar, listartodos, buscarPorId, atualizar, deletar, login };
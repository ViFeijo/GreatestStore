const bcrypt = require('bcrypt');
const model = require('../models/usuariomodel');
const JWT_SECRET = process.env.JWT_SECRET;

async function criar(nome, email, senha) {
  const hash = await bcrypt.hash(senha, 10);
  const usuario = {id: model.gerarId(), nome, email, senha: hash};
  model.salvar(usuario);
  return {id: usuario.id, nome, email};
}

function listartodos() {
  return model.buscarTodos().map(({senha, ...resto}) => resto);
}

function buscarPorId(id) {
  return model.buscarPorId(id);
}

async function atualizar(id, dados) {
  const index = model.buscarIndex(id);
  if (index === -1) return null;
  if (dados.senha) {
    dados.senha = await bcrypt.hash(dados.senha, 10);
  }
  const atualizado = model.atualizar(index, dados);
  const {senha, ...semSenha} = atualizado;
  return semSenha;
}

function deletar(id) {
  const index = model.buscarIndex(id);
  if (index === -1) return false;
  model.deletar(index);
  return true;
}

async function login(email, senha) {
  const usuario = model.buscarPorEmail(email);
  if (!usuario) return null;
  const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
  if (!senhaCorreta) return null;

 const token = jwt.sign(//é a biblioteca que cria e valida os tokens JWT no Node.js.
    { id: usuario.id, email: usuario.email, role: usuario.role },
    'segredo123',
    { expiresIn: '7d' }// medida de segurança gera um novo
  );
  return { token };
}

module.exports = { criar, listartodos, buscarPorId, atualizar, deletar, login };
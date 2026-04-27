const service = require('../services/usuarioservice');

async function criar(req, res) {
  const { nome, email, senha } = req.body;
  const novo = await service.criar(nome, email, senha);
  res.status(201).json(novo);
}

async function listartodos(req, res) {
  res.json(await service.listartodos());
}

async function buscarPorId(req, res) {
  const usuario = await service.buscarPorId(Number(req.params.id));
  if (!usuario) return res.status(404).json({ erro: 'Não encontrado' });
  const { senha, ...semSenha } = usuario;
  res.json(semSenha);
}

async function atualizar(req, res) {
  const atualizado = await service.atualizar(Number(req.params.id), req.body);
  if (!atualizado) return res.status(404).json({ erro: 'Não encontrado' });
  res.json(atualizado);
}

async function deletar(req, res) {
  const ok = await service.deletar(Number(req.params.id));
  if (!ok) return res.status(404).json({ erro: 'Não encontrado' });
  res.status(204).send();
}

async function login(req, res) {
  const { email, senha } = req.body;
  const usuario = await service.login(email, senha);
  if (!usuario) return res.status(401).json({ erro: 'Credenciais inválidas' });
  res.json(usuario);
}

module.exports = { criar, listartodos, buscarPorId, atualizar, deletar, login };
const pool = require('../config/db');

async function salvar(usuario) {
  const { nome, email, senha, role } = usuario;
  const result = await pool.query(
    'INSERT INTO usuarios (nome, email, senha, role) VALUES ($1, $2, $3, $4) RETURNING *',
    [nome, email, senha, role || 'comprador']
  );
  return result.rows[0];
}

async function buscarTodos() {
  const result = await pool.query('SELECT * FROM usuarios');
  return result.rows;
}

async function buscarPorId(id) {
  const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
  return result.rows[0];
}

async function buscarPorEmail(email) {
  const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
  return result.rows[0];
}

async function atualizar(id, dados) {
  const { nome, email, senha } = dados;
  const result = await pool.query(
    'UPDATE usuarios SET nome = $1, email = $2, senha = $3 WHERE id = $4 RETURNING *',
    [nome, email, senha, id]
  );
  return result.rows[0];
}

async function deletar(id) {
  await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
}

module.exports = { salvar, buscarTodos, buscarPorId, buscarPorEmail, atualizar, deletar };
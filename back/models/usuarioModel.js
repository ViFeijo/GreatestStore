const pool = require('../config/db');

async function criar(nome, email, senhaHash, role = 'cliente') {
  const result = await pool.query(
    'INSERT INTO usuarios (nome, email, senha, role) VALUES ($1, $2, $3, $4) RETURNING id, nome, email, role, criado_em',
    [nome, email, senhaHash, role]
  );
  return result.rows[0];
}

async function buscarPorEmail(email) {
  const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
  return result.rows[0];
}

async function buscarPorId(id) {
  const result = await pool.query(
    'SELECT id, nome, email, role, criado_em FROM usuarios WHERE id = $1', [id]
  );
  return result.rows[0];
}

async function buscarTodos() {
  const result = await pool.query('SELECT id, nome, email, role, criado_em FROM usuarios');
  return result.rows;
}

async function atualizar(id, nome, email) {
  const result = await pool.query(
    'UPDATE usuarios SET nome=$1, email=$2 WHERE id=$3 RETURNING id, nome, email, role',
    [nome, email, id]
  );
  return result.rows[0];
}

async function deletar(id) {
  const result = await pool.query('DELETE FROM usuarios WHERE id=$1 RETURNING *', [id]);
  return result.rows[0];
}

module.exports = { criar, buscarPorEmail, buscarPorId, buscarTodos, atualizar, deletar };
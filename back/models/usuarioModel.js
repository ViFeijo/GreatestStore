const pool = require('../config/db');

async function criar(email, senhaHash, cpf, role = 'cliente', nome = null) {
  const result = await pool.query(
    `INSERT INTO usuarios (nome, email, senha, cpf, role) 
     VALUES ($1, $2, $3, $4, $5) 
     RETURNING id, nome, email, cpf, role, criado_em`,
    [nome, email, senhaHash, cpf, role]
  );
  return result.rows[0];
}

async function buscarPorEmail(email) {
  const result = await pool.query(
    'SELECT * FROM usuarios WHERE email = $1',
    [email]
  );
  return result.rows[0];
}

async function buscarPorCpf(cpf) {
  const result = await pool.query(
    'SELECT * FROM usuarios WHERE cpf = $1',
    [cpf]
  );
  return result.rows[0];
}

async function buscarPorId(id) {
  const result = await pool.query(
    'SELECT id, nome, email, cpf, role, criado_em FROM usuarios WHERE id = $1',
    [id]
  );
  return result.rows[0];
}

async function buscarTodos() {
  const result = await pool.query(
    'SELECT id, nome, email, cpf, role, criado_em FROM usuarios'
  );
  return result.rows;
}

async function atualizar(id, nome, email) {
  const result = await pool.query(
    `UPDATE usuarios SET nome=$1, email=$2 
     WHERE id=$3 RETURNING id, nome, email, cpf, role`,
    [nome, email, id]
  );
  return result.rows[0];
}

async function deletar(id) {
  const result = await pool.query(
    'DELETE FROM usuarios WHERE id=$1 RETURNING *',
    [id]
  );
  return result.rows[0];
}

module.exports = { criar, buscarPorEmail, buscarPorCpf, buscarPorId, buscarTodos, atualizar, deletar };
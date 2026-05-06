const pool = require('../config/db');

async function criar(nome) {
  const result = await pool.query(
    `INSERT INTO categorias (nome) VALUES ($1) RETURNING *`,
    [nome]
  );
  return result.rows[0];
}

async function listartodos() {
  const result = await pool.query(
    `SELECT * FROM categorias ORDER BY nome ASC`
  );
  return result.rows;
}

async function buscarPorId(id) {
  const result = await pool.query(
    `SELECT * FROM categorias WHERE id = $1`,
    [id]
  );
  return result.rows[0];
}

async function atualizar(id, nome) {
  const result = await pool.query(
    `UPDATE categorias SET nome=$1 WHERE id=$2 RETURNING *`,
    [nome, id]
  );
  return result.rows[0];
}

async function deletar(id) {
  const result = await pool.query(
    `DELETE FROM categorias WHERE id=$1 RETURNING *`,
    [id]
  );
  return result.rows[0];
}

module.exports = { criar, listartodos, buscarPorId, atualizar, deletar };
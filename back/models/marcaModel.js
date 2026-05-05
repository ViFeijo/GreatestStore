const pool = require('../config/db');

async function criar(nome) {
  const result = await pool.query(
    `INSERT INTO marcas (nome) VALUES ($1) RETURNING *`,
    [nome]
  );
  return result.rows[0];
}

async function buscarPorNome(nome) {
  const result = await pool.query(
    `SELECT * FROM marcas WHERE LOWER(nome) = LOWER($1)`,
    [nome]
  );
  return result.rows[0];
}

async function buscarPorId(id) {
  const result = await pool.query(
    `SELECT * FROM marcas WHERE id = $1`,
    [id]
  );
  return result.rows[0];
}

async function listartodos() {
  const result = await pool.query(
    `SELECT * FROM marcas ORDER BY nome ASC`
  );
  return result.rows;
}

async function buscarParaCarrossel() {
  const result = await pool.query(
    `SELECT id, nome, logo_url FROM marcas ORDER BY nome ASC LIMIT 20`
  );
  return result.rows;
}

async function atualizar(id, nome) {
  const result = await pool.query(
    `UPDATE marcas SET nome=$1 WHERE id=$2 RETURNING *`,
    [nome, id]
  );
  return result.rows[0];
}

async function deletar(id) {
  const result = await pool.query(
    `DELETE FROM marcas WHERE id=$1 RETURNING *`,
    [id]
  );
  return result.rows[0];
}

module.exports = { criar, buscarPorNome, buscarPorId, listartodos, buscarParaCarrossel, atualizar, deletar };
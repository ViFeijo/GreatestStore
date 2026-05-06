const pool = require('../config/db');

async function criar(categoria_id, nome) {
  const result = await pool.query(
    `INSERT INTO subcategorias (categoria_id, nome) VALUES ($1, $2) RETURNING *`,
    [categoria_id, nome]
  );
  return result.rows[0];
}

async function listarPorCategoria(categoria_id) {
  const result = await pool.query(
    `SELECT s.*, c.nome AS categoria_nome 
     FROM subcategorias s
     JOIN categorias c ON s.categoria_id = c.id
     WHERE s.categoria_id = $1
     ORDER BY s.nome ASC`,
    [categoria_id]
  );
  return result.rows;
}

async function listartodos() {
  const result = await pool.query(
    `SELECT s.*, c.nome AS categoria_nome 
     FROM subcategorias s
     JOIN categorias c ON s.categoria_id = c.id
     ORDER BY c.nome ASC, s.nome ASC`
  );
  return result.rows;
}

async function buscarPorId(id) {
  const result = await pool.query(
    `SELECT s.*, c.nome AS categoria_nome 
     FROM subcategorias s
     JOIN categorias c ON s.categoria_id = c.id
     WHERE s.id = $1`,
    [id]
  );
  return result.rows[0];
}

async function atualizar(id, nome) {
  const result = await pool.query(
    `UPDATE subcategorias SET nome=$1 WHERE id=$2 RETURNING *`,
    [nome, id]
  );
  return result.rows[0];
}

async function deletar(id) {
  const result = await pool.query(
    `DELETE FROM subcategorias WHERE id=$1 RETURNING *`,
    [id]
  );
  return result.rows[0];
}

module.exports = { criar, listarPorCategoria, listartodos, buscarPorId, atualizar, deletar };
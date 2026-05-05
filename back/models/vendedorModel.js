const pool = require('../config/db');

async function criar(usuario_id, nome_fantasia, razao_social, cnpj) {
  const result = await pool.query(
    `INSERT INTO vendedores (usuario_id, nome_fantasia, razao_social, cnpj)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [usuario_id, nome_fantasia, razao_social, cnpj]
  );
  return result.rows[0];
}

async function buscarPorEmail(email) {
  const result = await pool.query(
    `SELECT u.*, v.id AS vendedor_id, v.nome_fantasia, v.razao_social, v.cnpj
     FROM usuarios u
     JOIN vendedores v ON u.id = v.usuario_id
     WHERE u.email = $1 AND u.role = 'vendedor'`,
    [email]
  );
  return result.rows[0];
}

async function buscarPorId(id) {
  const result = await pool.query(
    `SELECT v.*, u.email FROM vendedores v
     JOIN usuarios u ON v.usuario_id = u.id
     WHERE v.id = $1`,
    [id]
  );
  return result.rows[0];
}

async function listartodos() {
  const result = await pool.query(
    `SELECT v.*, u.email FROM vendedores v
     JOIN usuarios u ON v.usuario_id = u.id`
  );
  return result.rows;
}

async function atualizar(id, nome_fantasia, razao_social) {
  const result = await pool.query(
    `UPDATE vendedores SET nome_fantasia=$1, razao_social=$2
     WHERE id=$3 RETURNING *`,
    [nome_fantasia, razao_social, id]
  );
  return result.rows[0];
}

async function deletar(id) {
  const result = await pool.query('DELETE FROM vendedores WHERE id=$1 RETURNING *', [id]);
  return result.rows[0];
}

module.exports = { criar, buscarPorEmail, buscarPorId, listartodos, atualizar, deletar };   
const pool = require('../config/db');

async function buscarAtivos() {
  const result = await pool.query(
    `SELECT id, nome, descricao, banner_url, data_inicio, data_fim
     FROM eventos
     WHERE ativo = TRUE AND data_fim > NOW()
     ORDER BY data_inicio ASC`
  );
  return result.rows;
}

async function buscarPorId(id) {
  const result = await pool.query(
    'SELECT * FROM eventos WHERE id = $1',
    [id]
  );
  return result.rows[0];
}

async function criar(dados) {
  const { nome, descricao, data_inicio, data_fim, banner_url } = dados;
  const result = await pool.query(
    `INSERT INTO eventos (nome, descricao, data_inicio, data_fim, banner_url)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [nome, descricao, data_inicio, data_fim, banner_url]
  );
  return result.rows[0];
}

async function atualizar(id, dados) {
  const { nome, descricao, data_inicio, data_fim, banner_url, ativo } = dados;
  const result = await pool.query(
    `UPDATE eventos SET nome=$1, descricao=$2, data_inicio=$3, data_fim=$4,
     banner_url=$5, ativo=$6 WHERE id=$7 RETURNING *`,
    [nome, descricao, data_inicio, data_fim, banner_url, ativo, id]
  );
  return result.rows[0];
}

async function deletar(id) {
  const result = await pool.query(
    'DELETE FROM eventos WHERE id=$1 RETURNING *',
    [id]
  );
  return result.rows[0];
}

module.exports = { buscarAtivos, buscarPorId, criar, atualizar, deletar };
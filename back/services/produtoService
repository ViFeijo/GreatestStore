const pool = require('../config/db');

async function criar(nome, email, senha) {
  const result = await pool.query(
    'INSERT INTO produtos (nome, descricao, preco) VALUES ($1, $2, $3) RETURNING *',
    [nome, descricao, preco]
  );
  return result.rows[0];
}

async function listartodos() {
  const result = await pool.query('SELECT * FROM produtos');
  return result.rows;
}

async function buscarPorId(id) {
  const result = await pool.query('SELECT * FROM produtos WHERE id = $1', [id]);
  return result.rows[0];
}

async function atualizar(id, dados) {
  const { nome, descricao, preco } = dados;
  const result = await pool.query(
    'UPDATE produtos SET nome = $1, descricao = $2, preco = $3 WHERE id = $4 RETURNING *',
    [nome, descricao, preco, id]
  );
  return result.rows[0];
}

async function deletar(id) {
  await pool.query('DELETE FROM produtos WHERE id = $1', [id]);
}

module.exports = { criar, listartodos, buscarPorId, atualizar, deletar };
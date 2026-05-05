const pool = require('../config/db');

async function criar(usuario_id, dados) {
  const { apelido, cep, rua, numero, complemento, bairro, cidade, estado } = dados;
  const result = await pool.query(
    `INSERT INTO enderecos_usuario 
     (usuario_id, apelido, cep, rua, numero, complemento, bairro, cidade, estado)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
    [usuario_id, apelido, cep, rua, numero, complemento, bairro, cidade, estado]
  );
  return result.rows[0];
}

async function listarPorUsuario(usuario_id) {
  const result = await pool.query(
    'SELECT * FROM enderecos_usuario WHERE usuario_id = $1 ORDER BY is_principal DESC',
    [usuario_id]
  );
  return result.rows;
}

async function buscarPorId(id) {
  const result = await pool.query(
    'SELECT * FROM enderecos_usuario WHERE id = $1',
    [id]
  );
  return result.rows[0];
}

async function definirPrincipal(id, usuario_id) {
  await pool.query(
    'UPDATE enderecos_usuario SET is_principal = FALSE WHERE usuario_id = $1',
    [usuario_id]
  );
  const result = await pool.query(
    'UPDATE enderecos_usuario SET is_principal = TRUE WHERE id = $1 RETURNING *',
    [id]
  );
  return result.rows[0];
}

async function atualizar(id, dados) {
  const { apelido, cep, rua, numero, complemento, bairro, cidade, estado } = dados;
  const result = await pool.query(
    `UPDATE enderecos_usuario SET apelido=$1, cep=$2, rua=$3, numero=$4,
     complemento=$5, bairro=$6, cidade=$7, estado=$8
     WHERE id=$9 RETURNING *`,
    [apelido, cep, rua, numero, complemento, bairro, cidade, estado, id]
  );
  return result.rows[0];
}

async function deletar(id) {
  const result = await pool.query(
    'DELETE FROM enderecos_usuario WHERE id=$1 RETURNING *',
    [id]
  );
  return result.rows[0];
}

module.exports = { criar, listarPorUsuario, buscarPorId, definirPrincipal, atualizar, deletar };
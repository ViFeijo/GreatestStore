const pool = require('../config/db');

async function criar(usuario_id, cnpj) {
  const result = await pool.query(
    `INSERT INTO vendedores (usuario_id, cnpj, nome_fantasia, razao_social) 
     VALUES ($1, $2, '', '') 
     RETURNING *`,
    [usuario_id, cnpj]
  );
  return result.rows[0];
}

async function buscarPorUsuarioId(usuario_id) {
  const result = await pool.query(
    `SELECT v.*, u.nome, u.email, u.cpf FROM vendedores v
     JOIN usuarios u ON v.usuario_id = u.id
     WHERE v.usuario_id = $1`,
    [usuario_id]
  );
  return result.rows[0];
}

async function buscarPorCnpj(cnpj) {
  const result = await pool.query(
    'SELECT * FROM vendedores WHERE cnpj = $1',
    [cnpj]
  );
  return result.rows[0];
}

async function buscarPorId(id) {
  const result = await pool.query(
    `SELECT v.*, u.nome, u.email FROM vendedores v
     JOIN usuarios u ON v.usuario_id = u.id
     WHERE v.id = $1`,
    [id]
  );
  return result.rows[0];
}

async function listartodos() {
  const result = await pool.query(
    `SELECT v.*, u.nome, u.email FROM vendedores v
     JOIN usuarios u ON v.usuario_id = u.id`
  );
  return result.rows;
}

async function completarPerfil(usuario_id, nome_fantasia, razao_social) {
  const result = await pool.query(
    `UPDATE vendedores SET nome_fantasia=$1, razao_social=$2
     WHERE usuario_id=$3 RETURNING *`,
    [nome_fantasia, razao_social, usuario_id]
  );
  return result.rows[0];
}

async function atualizar(usuario_id, dados) {
  const { nome_fantasia, razao_social, foto_perfil_url, banner_url } = dados;
  const result = await pool.query(
    `UPDATE vendedores SET nome_fantasia=$1, razao_social=$2, 
     foto_perfil_url=$3, banner_url=$4
     WHERE usuario_id=$5 RETURNING *`,
    [nome_fantasia, razao_social, foto_perfil_url, banner_url, usuario_id]
  );
  return result.rows[0];
}

async function deletar(usuario_id) {
  const result = await pool.query(
    'DELETE FROM vendedores WHERE usuario_id=$1 RETURNING *',
    [usuario_id]
  );
  return result.rows[0];
}

module.exports = { criar, buscarPorUsuarioId, buscarPorCnpj, buscarPorId, listartodos, completarPerfil, atualizar, deletar };
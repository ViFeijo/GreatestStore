const pool = require('../config/db');

async function criar(produto_id, usuario_id, nota, comentario) {
  const result = await pool.query(
    `INSERT INTO avaliacoes_produtos (produto_id, usuario_id, nota, comentario)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [produto_id, usuario_id, nota, comentario]
  );
  return result.rows[0];
}

async function listarPorProduto(produto_id) {
  const result = await pool.query(
    `SELECT a.*, u.nome AS usuario_nome
     FROM avaliacoes_produtos a
     JOIN usuarios u ON a.usuario_id = u.id
     WHERE a.produto_id = $1
     ORDER BY a.criado_em DESC`,
    [produto_id]
  );
  return result.rows;
}

async function mediaPorProduto(produto_id) {
  const result = await pool.query(
    `SELECT 
        COUNT(*) AS total_avaliacoes,
        ROUND(AVG(nota), 1) AS media
     FROM avaliacoes_produtos
     WHERE produto_id = $1`,
    [produto_id]
  );
  return result.rows[0];
}

async function buscarPorUsuarioEProduto(usuario_id, produto_id) {
  const result = await pool.query(
    `SELECT * FROM avaliacoes_produtos 
     WHERE usuario_id = $1 AND produto_id = $2`,
    [usuario_id, produto_id]
  );
  return result.rows[0];
}

async function atualizar(id, nota, comentario) {
  const result = await pool.query(
    `UPDATE avaliacoes_produtos SET nota=$1, comentario=$2
     WHERE id=$3 RETURNING *`,
    [nota, comentario, id]
  );
  return result.rows[0];
}

async function deletar(id, usuario_id) {
  const result = await pool.query(
    `DELETE FROM avaliacoes_produtos 
     WHERE id=$1 AND usuario_id=$2 RETURNING *`,
    [id, usuario_id]
  );
  return result.rows[0];
}

module.exports = { criar, listarPorProduto, mediaPorProduto, buscarPorUsuarioEProduto, atualizar, deletar };
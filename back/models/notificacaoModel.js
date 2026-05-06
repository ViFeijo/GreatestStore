const pool = require('../config/db');

async function criar(usuario_id, titulo, mensagem) {
  const result = await pool.query(
    `INSERT INTO notificacoes (usuario_id, titulo, mensagem)
     VALUES ($1, $2, $3) RETURNING *`,
    [usuario_id, titulo, mensagem]
  );
  return result.rows[0];
}

async function listarPorUsuario(usuario_id) {
  const result = await pool.query(
    `SELECT * FROM notificacoes 
     WHERE usuario_id = $1 
     ORDER BY criado_em DESC`,
    [usuario_id]
  );
  return result.rows;
}

async function marcarComoLida(id, usuario_id) {
  const result = await pool.query(
    `UPDATE notificacoes SET lida = TRUE 
     WHERE id = $1 AND usuario_id = $2 RETURNING *`,
    [id, usuario_id]
  );
  return result.rows[0];
}

async function marcarTodasComoLidas(usuario_id) {
  const result = await pool.query(
    `UPDATE notificacoes SET lida = TRUE 
     WHERE usuario_id = $1 RETURNING *`,
    [usuario_id]
  );
  return result.rows;
}

async function deletar(id, usuario_id) {
  const result = await pool.query(
    `DELETE FROM notificacoes 
     WHERE id = $1 AND usuario_id = $2 RETURNING *`,
    [id, usuario_id]
  );
  return result.rows[0];
}

async function contarNaoLidas(usuario_id) {
  const result = await pool.query(
    `SELECT COUNT(*) AS total 
     FROM notificacoes 
     WHERE usuario_id = $1 AND lida = FALSE`,
    [usuario_id]
  );
  return parseInt(result.rows[0].total);
}

module.exports = { criar, listarPorUsuario, marcarComoLida, marcarTodasComoLidas, deletar, contarNaoLidas };
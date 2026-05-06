const pool = require('../config/db');

async function criar(pedido_id, metodo, valor) {
  const result = await pool.query(
    `INSERT INTO pagamentos (pedido_id, metodo, valor)
     VALUES ($1, $2, $3) RETURNING *`,
    [pedido_id, metodo, valor]
  );
  return result.rows[0];
}

async function buscarPorPedido(pedido_id) {
  const result = await pool.query(
    `SELECT * FROM pagamentos WHERE pedido_id = $1`,
    [pedido_id]
  );
  return result.rows[0];
}

async function atualizarStatus(id, status, codigo_transacao = null) {
  const result = await pool.query(
    `UPDATE pagamentos SET status=$1, codigo_transacao=$2,
     pago_em = CASE WHEN $1 = 'aprovado' THEN NOW() ELSE pago_em END
     WHERE id=$3 RETURNING *`,
    [status, codigo_transacao, id]
  );
  return result.rows[0];
}

async function listarPorUsuario(usuario_id) {
  const result = await pool.query(
    `SELECT pg.*, p.criado_em AS pedido_criado_em, p.valor_total
     FROM pagamentos pg
     JOIN pedidos p ON pg.pedido_id = p.id
     WHERE p.usuario_id = $1
     ORDER BY pg.criado_em DESC`,
    [usuario_id]
  );
  return result.rows;
}

module.exports = { criar, buscarPorPedido, atualizarStatus, listarPorUsuario };
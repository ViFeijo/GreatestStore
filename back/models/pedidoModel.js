const pool = require('../config/db');

async function criar(usuario_id, endereco_id, valor_total, cupom_id = null) {
  const result = await pool.query(
    `INSERT INTO pedidos (usuario_id, endereco_id, valor_total, cupom_id)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [usuario_id, endereco_id, valor_total, cupom_id]
  );
  return result.rows[0];
}

async function adicionarItens(pedido_id, itens) {
  const values = itens.map(item =>
    `('${pedido_id}', '${item.produto_id}', ${item.quantidade}, ${item.preco_unitario})`
  ).join(', ');

  const result = await pool.query(
    `INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario)
     VALUES ${values} RETURNING *`
  );
  return result.rows;
}

async function listarPorUsuario(usuario_id) {
  const result = await pool.query(
    `SELECT p.*, 
        json_agg(json_build_object(
          'produto_id', ip.produto_id,
          'quantidade', ip.quantidade,
          'preco_unitario', ip.preco_unitario
        )) AS itens
     FROM pedidos p
     JOIN itens_pedido ip ON p.id = ip.pedido_id
     WHERE p.usuario_id = $1
     GROUP BY p.id
     ORDER BY p.criado_em DESC`,
    [usuario_id]
  );
  return result.rows;
}

async function buscarPorId(id) {
  const result = await pool.query(
    `SELECT p.*,
        json_agg(json_build_object(
          'produto_id', ip.produto_id,
          'quantidade', ip.quantidade,
          'preco_unitario', ip.preco_unitario
        )) AS itens
     FROM pedidos p
     JOIN itens_pedido ip ON p.id = ip.pedido_id
     WHERE p.id = $1
     GROUP BY p.id`,
    [id]
  );
  return result.rows[0];
}

async function atualizarStatus(id, status) {
  const result = await pool.query(
    'UPDATE pedidos SET status=$1 WHERE id=$2 RETURNING *',
    [status, id]
  );
  return result.rows[0];
}

module.exports = { criar, adicionarItens, listarPorUsuario, buscarPorId, atualizarStatus };
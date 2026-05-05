const pool = require('../config/db');

async function adicionar(usuario_id, produto_id, quantidade) {
  const result = await pool.query(
    `INSERT INTO carrinho (usuario_id, produto_id, quantidade)
     VALUES ($1, $2, $3)
     ON CONFLICT (usuario_id, produto_id)
     DO UPDATE SET quantidade = carrinho.quantidade + $3
     RETURNING *`,
    [usuario_id, produto_id, quantidade]
  );
  return result.rows[0];
}

async function listar(usuario_id) {
  const result = await pool.query(
    `SELECT 
        c.id,
        c.quantidade,
        p.id AS produto_id,
        p.nome,
        p.preco,
        p.preco_promocional,
        p.desconto_ativo,
        p.quantidade AS estoque,
        pi.url AS imagem_url,
        m.nome AS marca_nome,
        v.id AS vendedor_id,
        ev.cep AS cep_vendedor,
        CASE 
          WHEN p.desconto_ativo AND p.preco_promocional IS NOT NULL 
          THEN p.preco_promocional 
          ELSE p.preco 
        END AS preco_final,
        CASE 
          WHEN p.desconto_ativo AND p.preco_promocional IS NOT NULL 
          THEN p.preco_promocional * c.quantidade
          ELSE p.preco * c.quantidade 
        END AS subtotal_item
     FROM carrinho c
     JOIN produtos p ON c.produto_id = p.id
     JOIN vendedores v ON p.vendedor_id = v.id
     LEFT JOIN enderecos_vendedor ev ON v.id = ev.vendedor_id
     LEFT JOIN marcas m ON p.marca_id = m.id
     LEFT JOIN produto_imagens pi ON p.id = pi.produto_id AND pi.is_principal = TRUE
     WHERE c.usuario_id = $1`,
    [usuario_id]
  );
  return result.rows;
}

async function atualizar(id, usuario_id, quantidade) {
  const result = await pool.query(
    `UPDATE carrinho SET quantidade=$1
     WHERE id=$2 AND usuario_id=$3 RETURNING *`,
    [quantidade, id, usuario_id]
  );
  return result.rows[0];
}

async function remover(id, usuario_id) {
  const result = await pool.query(
    'DELETE FROM carrinho WHERE id=$1 AND usuario_id=$2 RETURNING *',
    [id, usuario_id]
  );
  return result.rows[0];
}

async function limpar(usuario_id) {
  await pool.query('DELETE FROM carrinho WHERE usuario_id=$1', [usuario_id]);
}

module.exports = { adicionar, listar, atualizar, remover, limpar };
const pool = require('../config/db');

async function adicionar(usuario_id, produto_id) {
  const result = await pool.query(
    `INSERT INTO favoritos (usuario_id, produto_id)
     VALUES ($1, $2) RETURNING *`,
    [usuario_id, produto_id]
  );
  return result.rows[0];
}

async function listar(usuario_id) {
  const result = await pool.query(
    `SELECT 
        p.id, p.nome, p.quantidade, p.preco, p.preco_promocional, p.desconto_ativo,
        CASE WHEN p.desconto_ativo AND p.preco_promocional IS NOT NULL 
          THEN p.preco_promocional ELSE p.preco END AS preco_final,
        m.nome AS marca_nome,
        pi.url AS imagem_url,
        ROUND(AVG(a.nota), 1) AS media_avaliacoes,
        COUNT(a.id) AS total_avaliacoes
     FROM favoritos f
     JOIN produtos p ON f.produto_id = p.id
     LEFT JOIN marcas m ON p.marca_id = m.id
     LEFT JOIN produto_imagens pi ON p.id = pi.produto_id AND pi.is_principal = TRUE
     LEFT JOIN avaliacoes_produtos a ON p.id = a.produto_id
     WHERE f.usuario_id = $1
     GROUP BY p.id, m.nome, pi.url
     ORDER BY p.nome ASC`,
    [usuario_id]
  );
  return result.rows;
}

async function verificar(usuario_id, produto_id) {
  const result = await pool.query(
    `SELECT * FROM favoritos WHERE usuario_id = $1 AND produto_id = $2`,
    [usuario_id, produto_id]
  );
  return result.rows[0];
}

async function remover(usuario_id, produto_id) {
  const result = await pool.query(
    `DELETE FROM favoritos WHERE usuario_id = $1 AND produto_id = $2 RETURNING *`,
    [usuario_id, produto_id]
  );
  return result.rows[0];
}

module.exports = { adicionar, listar, verificar, remover };
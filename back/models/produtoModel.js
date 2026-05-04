const pool = require('../config/db');

async function criar(dados) {
  const { nome, descricao, preco, vendedor_id, subcategoria_id, imagem_url, preco_promocional, desconto_ativo } = dados;
  const query = `INSERT INTO produtos (nome, descricao, preco, vendedor_id, subcategoria_id, imagem_url, preco_promocional, desconto_ativo)
                  VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;
  const values = [nome, descricao, preco, vendedor_id, subcategoria_id, imagem_url, preco_promocional || null, desconto_ativo || false];
  const result = await pool.query(query, values);
  return result.rows[0];
}

async function listartodos() {  
  const query = `SELECT p.*, u.nome AS vendedor_nome, s.nome AS subcategoria_nome
                 FROM produtos p
                 LEFT JOIN usuarios u ON p.vendedor_id = u.id
                 LEFT JOIN subcategorias s ON p.subcategoria_id = s.id
                  ORDER BY p.id`;
  const result = await pool.query(query);
  return result.rows;
}

async function buscarPorId(id) {
  const query = `SELECT p.*, us.nome AS subcategoria_nome, c.nome AS categoria_nome, u.nome AS vendedor_nome
                 FROM produtos p
                 JOIN usuarios u ON p.vendedor_id = u.id
                 JOIN subcategorias s ON p.subcategoria_id = s.id
                 JOIN categorias c ON s.categoria_id = c.id
                 WHERE p.id = $1`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
}

async function atualizar(id, dados) {
  const { nome, descricao, preco, vendedor_id, subcategoria_id, imagem_url, preco_promocional, desconto_ativo } = dados;
  const result = await pool.query(
    'UPDATE produtos SET nome = $1, descricao = $2, preco = $3, vendedor_id = $4, subcategoria_id = $5, imagem_url = $6, preco_promocional = $7, desconto_ativo = $8 WHERE id = $9 RETURNING *',
    [nome, descricao, preco, vendedor_id, subcategoria_id, imagem_url, preco_promocional || null, desconto_ativo || false, id]
  );
  return result.rows[0];
}

async function deletar(id) {
  const query = 'DELETE FROM produtos WHERE id = $1';
  const result = await pool.query(query, [id]);
  return result.rowCount > 0; // Retorna true se um produto foi deletado, false caso contrário
}

module.exports = { criar, listartodos, buscarPorId, atualizar, deletar };   
const pool = require('../config/db');

async function criar(dados) {
  const { nome, descricao, preco, vendedor_id, subcategoria_id, preco_promocional, desconto_ativo } = dados;
  const result = await pool.query(
    `INSERT INTO produtos (nome, descricao, preco, vendedor_id, subcategoria_id, preco_promocional, desconto_ativo)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [nome, descricao, preco, vendedor_id, subcategoria_id, preco_promocional || null, desconto_ativo || false]
  );
  return result.rows[0];
}

async function listartodos() {
  const result = await pool.query(
    `SELECT p.*, v.nome_fantasia AS vendedor_nome, s.nome AS subcategoria_nome
     FROM produtos p
     LEFT JOIN vendedores v ON p.vendedor_id = v.id
     LEFT JOIN subcategorias s ON p.subcategoria_id = s.id
     ORDER BY p.criado_em DESC`
  );
  return result.rows;
}

async function buscarPorId(id) {
  const result = await pool.query(
    `SELECT p.*, v.nome_fantasia AS vendedor_nome, v.foto_perfil_url, v.banner_url,
            s.nome AS subcategoria_nome, c.nome AS categoria_nome
     FROM produtos p
     JOIN vendedores v ON p.vendedor_id = v.id
     JOIN subcategorias s ON p.subcategoria_id = s.id
     JOIN categorias c ON s.categoria_id = c.id
     WHERE p.id = $1`,
    [id]
  );
  return result.rows[0];
}

async function atualizar(id, dados) {
  const { nome, descricao, preco, subcategoria_id, preco_promocional, desconto_ativo } = dados;
  const result = await pool.query(
    `UPDATE produtos SET nome=$1, descricao=$2, preco=$3, subcategoria_id=$4,
     preco_promocional=$5, desconto_ativo=$6 WHERE id=$7 RETURNING *`,
    [nome, descricao, preco, subcategoria_id, preco_promocional || null, desconto_ativo || false, id]
  );
  return result.rows[0];
}

async function deletar(id) {
  const result = await pool.query('DELETE FROM produtos WHERE id=$1', [id]);
  return result.rowCount > 0;
}

module.exports = { criar, listartodos, buscarPorId, atualizar, deletar };
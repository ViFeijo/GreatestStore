const pool = require('../config/db');

async function criar(dados) {
  const { vendedor_id, subcategoria_id, marca_id, nome, modelo, descricao, preco, quantidade, preco_promocional, desconto_ativo } = dados;
  const result = await pool.query(
    `INSERT INTO produtos (vendedor_id, subcategoria_id, marca_id, nome, modelo, descricao, preco, quantidade, preco_promocional, desconto_ativo)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
    [vendedor_id, subcategoria_id, marca_id, nome, modelo, descricao, preco, quantidade, preco_promocional || null, desconto_ativo || false]
  );
  return result.rows[0];
}

async function listartodos() {
  const result = await pool.query(
    `SELECT p.*, 
        v.nome_fantasia AS vendedor_nome,
        s.nome AS subcategoria_nome,
        m.nome AS marca_nome,
        pi.url AS imagem_url
     FROM produtos p
     LEFT JOIN vendedores v ON p.vendedor_id = v.id
     LEFT JOIN subcategorias s ON p.subcategoria_id = s.id
     LEFT JOIN marcas m ON p.marca_id = m.id
     LEFT JOIN produto_imagens pi ON p.id = pi.produto_id AND pi.is_principal = TRUE
     ORDER BY p.criado_em DESC`
  );
  return result.rows;
}

async function buscarPorId(id) {
  const result = await pool.query(
    `SELECT p.*,
        v.nome_fantasia AS vendedor_nome,
        v.foto_perfil_url AS vendedor_foto,
        v.banner_url AS vendedor_banner,
        s.nome AS subcategoria_nome,
        c.nome AS categoria_nome,
        m.nome AS marca_nome
     FROM produtos p
     JOIN vendedores v ON p.vendedor_id = v.id
     LEFT JOIN subcategorias s ON p.subcategoria_id = s.id
     LEFT JOIN categorias c ON s.categoria_id = c.id
     LEFT JOIN marcas m ON p.marca_id = m.id
     WHERE p.id = $1`,
    [id]
  );
  return result.rows[0];
}

async function buscarImagensPorId(id) {
  const result = await pool.query(
    'SELECT * FROM produto_imagens WHERE produto_id = $1 ORDER BY ordem',
    [id]
  );
  return result.rows;
}

async function buscarPorModelo(modelo) {
  const result = await pool.query(
    `SELECT p.*,
        m.nome AS marca_nome,
        mi.url AS imagem_url,
        mi.nome AS imagem_nome
     FROM produtos p
     LEFT JOIN marcas m ON p.marca_id = m.id
     LEFT JOIN marca_imagens mi ON m.id = mi.marca_id
     WHERE LOWER(p.modelo) LIKE LOWER($1)
     ORDER BY mi.ordem`,
    [`%${modelo}%`]
  );
  return result.rows;
}

async function buscarPorVendedor(vendedor_id) {
  const result = await pool.query(
    `SELECT p.*, s.nome AS subcategoria_nome, m.nome AS marca_nome,
        pi.url AS imagem_url
     FROM produtos p
     LEFT JOIN subcategorias s ON p.subcategoria_id = s.id
     LEFT JOIN marcas m ON p.marca_id = m.id
     LEFT JOIN produto_imagens pi ON p.id = pi.produto_id AND pi.is_principal = TRUE
     WHERE p.vendedor_id = $1
     ORDER BY p.criado_em DESC`,
    [vendedor_id]
  );
  return result.rows;
}

async function atualizar(id, dados) {
  const { subcategoria_id, marca_id, nome, modelo, descricao, preco, quantidade, preco_promocional, desconto_ativo } = dados;
  const result = await pool.query(
    `UPDATE produtos SET subcategoria_id=$1, marca_id=$2, nome=$3, modelo=$4,
     descricao=$5, preco=$6, quantidade=$7, preco_promocional=$8, desconto_ativo=$9
     WHERE id=$10 RETURNING *`,
    [subcategoria_id, marca_id, nome, modelo, descricao, preco, quantidade, preco_promocional || null, desconto_ativo || false, id]
  );
  return result.rows[0];
}

async function deletar(id) {
  const result = await pool.query(
    'DELETE FROM produtos WHERE id=$1 RETURNING *',
    [id]
  );
  return result.rows[0];
}

module.exports = { criar, listartodos, buscarPorId, buscarImagensPorId, buscarPorModelo, buscarPorVendedor, atualizar, deletar };
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
        pi.url AS imagem_url,
        ROUND(AVG(a.nota), 1) AS media_avaliacoes,
        COUNT(a.id) AS total_avaliacoes
     FROM produtos p
     LEFT JOIN vendedores v ON p.vendedor_id = v.id
     LEFT JOIN subcategorias s ON p.subcategoria_id = s.id
     LEFT JOIN marcas m ON p.marca_id = m.id
     LEFT JOIN produto_imagens pi ON p.id = pi.produto_id AND pi.is_principal = TRUE
     LEFT JOIN avaliacoes_produtos a ON p.id = a.produto_id
     GROUP BY p.id, v.nome_fantasia, s.nome, m.nome, pi.url
     ORDER BY p.criado_em DESC`
  );
  return result.rows;
}

async function buscarPorId(id) {
  const result = await pool.query(
    `SELECT p.*,
        v.id AS vendedor_id,
        v.nome_fantasia AS vendedor_nome,
        v.foto_perfil_url AS vendedor_foto,
        v.banner_url AS vendedor_banner,
        s.id AS subcategoria_id,
        s.nome AS subcategoria_nome,
        c.id AS categoria_id,
        c.nome AS categoria_nome,
        m.nome AS marca_nome,
        ROUND(AVG(a.nota), 1) AS media_avaliacoes,
        COUNT(a.id) AS total_avaliacoes
     FROM produtos p
     JOIN vendedores v ON p.vendedor_id = v.id
     LEFT JOIN subcategorias s ON p.subcategoria_id = s.id
     LEFT JOIN categorias c ON s.categoria_id = c.id
     LEFT JOIN marcas m ON p.marca_id = m.id
     LEFT JOIN avaliacoes_produtos a ON p.id = a.produto_id
     WHERE p.id = $1
     GROUP BY p.id, v.id, s.id, c.id, m.id`,
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
        pi.url AS imagem_url,
        ROUND(AVG(a.nota), 1) AS media_avaliacoes,
        COUNT(a.id) AS total_avaliacoes
     FROM produtos p
     LEFT JOIN subcategorias s ON p.subcategoria_id = s.id
     LEFT JOIN marcas m ON p.marca_id = m.id
     LEFT JOIN produto_imagens pi ON p.id = pi.produto_id AND pi.is_principal = TRUE
     LEFT JOIN avaliacoes_produtos a ON p.id = a.produto_id
     WHERE p.vendedor_id = $1
     GROUP BY p.id, s.nome, m.nome, pi.url
     ORDER BY p.criado_em DESC`,
    [vendedor_id]
  );
  return result.rows;
}

async function buscarFuzzy(termo) {
  const result = await pool.query(
    `SELECT p.*, 
        m.nome AS marca_nome,
        v.nome_fantasia AS vendedor_nome,
        pi.url AS imagem_url,
        ROUND(AVG(a.nota), 1) AS media_avaliacoes,
        COUNT(a.id) AS total_avaliacoes,
        GREATEST(similarity(p.nome, $1), similarity(COALESCE(p.modelo, ''), $1)) AS score
     FROM produtos p
     LEFT JOIN marcas m ON p.marca_id = m.id
     LEFT JOIN vendedores v ON p.vendedor_id = v.id
     LEFT JOIN produto_imagens pi ON p.id = pi.produto_id AND pi.is_principal = TRUE
     LEFT JOIN avaliacoes_produtos a ON p.id = a.produto_id
     WHERE 
         similarity(p.nome, $1) > 0.1
         OR similarity(COALESCE(p.modelo, ''), $1) > 0.1
         OR p.nome ILIKE '%' || $1 || '%'
         OR COALESCE(p.modelo, '') ILIKE '%' || $1 || '%'
     GROUP BY p.id, m.nome, v.nome_fantasia, pi.url
     ORDER BY score DESC
     LIMIT 20`,
    [termo]
  );
  return result.rows;
}

async function buscarParaCarrossel() {
  const result = await pool.query(
    `SELECT 
        p.id, p.nome, p.quantidade, p.preco, p.preco_promocional, p.desconto_ativo,
        CASE WHEN p.desconto_ativo AND p.preco_promocional IS NOT NULL 
          THEN p.preco_promocional ELSE p.preco END AS preco_final,
        m.nome AS marca_nome,
        pi.url AS imagem_url,
        ROUND(AVG(a.nota), 1) AS media_avaliacoes,
        COUNT(a.id) AS total_avaliacoes
     FROM produtos p
     LEFT JOIN marcas m ON p.marca_id = m.id
     LEFT JOIN produto_imagens pi ON p.id = pi.produto_id AND pi.is_principal = TRUE
     LEFT JOIN avaliacoes_produtos a ON p.id = a.produto_id
     WHERE p.quantidade > 0
     GROUP BY p.id, m.nome, pi.url
     ORDER BY p.criado_em DESC
     LIMIT 20`
  );
  return result.rows;
}

async function buscarPorCategoria(categoria_id) {
  const result = await pool.query(
    `SELECT 
        p.id, p.nome, p.quantidade, p.preco, p.preco_promocional, p.desconto_ativo,
        CASE WHEN p.desconto_ativo AND p.preco_promocional IS NOT NULL 
          THEN p.preco_promocional ELSE p.preco END AS preco_final,
        m.nome AS marca_nome,
        pi.url AS imagem_url,
        ROUND(AVG(a.nota), 1) AS media_avaliacoes,
        COUNT(a.id) AS total_avaliacoes
     FROM produtos p
     LEFT JOIN marcas m ON p.marca_id = m.id
     LEFT JOIN produto_imagens pi ON p.id = pi.produto_id AND pi.is_principal = TRUE
     LEFT JOIN subcategorias s ON p.subcategoria_id = s.id
     LEFT JOIN avaliacoes_produtos a ON p.id = a.produto_id
     WHERE s.categoria_id = $1 AND p.quantidade > 0
     GROUP BY p.id, m.nome, pi.url
     ORDER BY p.criado_em DESC
     LIMIT 20`,
    [categoria_id]
  );
  return result.rows;
}

async function buscarEmOferta() {
  const result = await pool.query(
    `SELECT 
        p.id, p.nome, p.quantidade, p.preco, p.preco_promocional, p.desconto_ativo,
        p.preco_promocional AS preco_final,
        m.nome AS marca_nome,
        pi.url AS imagem_url,
        ROUND(AVG(a.nota), 1) AS media_avaliacoes,
        COUNT(a.id) AS total_avaliacoes
     FROM produtos p
     LEFT JOIN marcas m ON p.marca_id = m.id
     LEFT JOIN produto_imagens pi ON p.id = pi.produto_id AND pi.is_principal = TRUE
     LEFT JOIN avaliacoes_produtos a ON p.id = a.produto_id
     WHERE p.desconto_ativo = TRUE AND p.preco_promocional IS NOT NULL AND p.quantidade > 0
     GROUP BY p.id, m.nome, pi.url
     ORDER BY (p.preco - p.preco_promocional) DESC
     LIMIT 20`
  );
  return result.rows;
}

async function buscarRandom() {
  const result = await pool.query(
    `SELECT 
        p.id, p.nome, p.quantidade, p.preco, p.preco_promocional, p.desconto_ativo,
        CASE WHEN p.desconto_ativo AND p.preco_promocional IS NOT NULL 
          THEN p.preco_promocional ELSE p.preco END AS preco_final,
        m.nome AS marca_nome,
        pi.url AS imagem_url,
        ROUND(AVG(a.nota), 1) AS media_avaliacoes,
        COUNT(a.id) AS total_avaliacoes
     FROM produtos p
     LEFT JOIN marcas m ON p.marca_id = m.id
     LEFT JOIN produto_imagens pi ON p.id = pi.produto_id AND pi.is_principal = TRUE
     LEFT JOIN avaliacoes_produtos a ON p.id = a.produto_id
     WHERE p.quantidade > 0
     GROUP BY p.id, m.nome, pi.url
     ORDER BY RANDOM()
     LIMIT 20`
  );
  return result.rows;
}

async function buscarFavoritos(usuario_id) {
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
     WHERE f.usuario_id = $1 AND p.quantidade > 0
     GROUP BY p.id, m.nome, pi.url
     ORDER BY p.criado_em DESC
     LIMIT 20`,
    [usuario_id]
  );
  return result.rows;
}

async function buscarPorEvento(evento_id) {
  const result = await pool.query(
    `SELECT 
        p.id, p.nome, p.quantidade, p.preco, p.preco_promocional, p.desconto_ativo,
        CASE WHEN p.desconto_ativo AND p.preco_promocional IS NOT NULL 
          THEN p.preco_promocional ELSE p.preco END AS preco_final,
        m.nome AS marca_nome,
        pi.url AS imagem_url,
        e.banner_url AS evento_banner,
        ROUND(AVG(a.nota), 1) AS media_avaliacoes,
        COUNT(a.id) AS total_avaliacoes
     FROM evento_produtos ep
     JOIN produtos p ON ep.produto_id = p.id
     JOIN eventos e ON ep.evento_id = e.id
     LEFT JOIN marcas m ON p.marca_id = m.id
     LEFT JOIN produto_imagens pi ON p.id = pi.produto_id AND pi.is_principal = TRUE
     LEFT JOIN avaliacoes_produtos a ON p.id = a.produto_id
     WHERE ep.evento_id = $1 AND p.quantidade > 0 AND e.ativo = TRUE
     GROUP BY p.id, m.nome, pi.url, e.banner_url
     LIMIT 20`,
    [evento_id]
  );
  return result.rows;
}

async function buscarPorSubcategoria(subcategoria_id) {
  const result = await pool.query(
    `SELECT 
        p.id, p.nome, p.quantidade, p.preco, p.preco_promocional, p.desconto_ativo,
        CASE WHEN p.desconto_ativo AND p.preco_promocional IS NOT NULL 
          THEN p.preco_promocional ELSE p.preco END AS preco_final,
        m.nome AS marca_nome,
        pi.url AS imagem_url,
        ROUND(AVG(a.nota), 1) AS media_avaliacoes,
        COUNT(a.id) AS total_avaliacoes
     FROM produtos p
     LEFT JOIN marcas m ON p.marca_id = m.id
     LEFT JOIN produto_imagens pi ON p.id = pi.produto_id AND pi.is_principal = TRUE
     LEFT JOIN avaliacoes_produtos a ON p.id = a.produto_id
     WHERE p.subcategoria_id = $1 AND p.quantidade > 0
     GROUP BY p.id, m.nome, pi.url
     ORDER BY p.criado_em DESC`,
    [subcategoria_id]
  );
  return result.rows;
}

async function buscarComFiltros({ termo, categoria_id, subcategoria_id, marca_id, preco_min, preco_max, apenas_oferta, ordenar }) {
  let where = ['p.quantidade > 0'];
  let valores = [];
  let i = 1;

  if (termo) {
    where.push(`(similarity(p.nome, $${i}) > 0.1 OR p.nome ILIKE '%' || $${i} || '%')`);
    valores.push(termo);
    i++;
  }

  if (categoria_id) {
    where.push(`s.categoria_id = $${i}`);
    valores.push(categoria_id);
    i++;
  }

  if (subcategoria_id) {
    where.push(`p.subcategoria_id = $${i}`);
    valores.push(subcategoria_id);
    i++;
  }

  if (marca_id) {
    where.push(`p.marca_id = $${i}`);
    valores.push(marca_id);
    i++;
  }

  if (preco_min) {
    where.push(`p.preco >= $${i}`);
    valores.push(preco_min);
    i++;
  }

  if (preco_max) {
    where.push(`p.preco <= $${i}`);
    valores.push(preco_max);
    i++;
  }

  if (apenas_oferta === 'true') {
    where.push(`p.desconto_ativo = TRUE AND p.preco_promocional IS NOT NULL`);
  }

  const ordens = {
    'mais_recentes': 'p.criado_em DESC',
    'menor_preco': 'preco_final ASC',
    'maior_preco': 'preco_final DESC'
  };

  const orderBy = ordens[ordenar] || 'p.criado_em DESC';

  const query = `
    SELECT 
        p.id, p.nome, p.quantidade, p.preco, p.preco_promocional, p.desconto_ativo,
        CASE WHEN p.desconto_ativo AND p.preco_promocional IS NOT NULL 
          THEN p.preco_promocional ELSE p.preco END AS preco_final,
        m.nome AS marca_nome,
        v.nome_fantasia AS vendedor_nome,
        s.nome AS subcategoria_nome,
        c.nome AS categoria_nome,
        pi.url AS imagem_url,
        ROUND(AVG(a.nota), 1) AS media_avaliacoes,
        COUNT(a.id) AS total_avaliacoes,
        COUNT(*) OVER() AS total_resultados
     FROM produtos p
     LEFT JOIN marcas m ON p.marca_id = m.id
     LEFT JOIN vendedores v ON p.vendedor_id = v.id
     LEFT JOIN subcategorias s ON p.subcategoria_id = s.id
     LEFT JOIN categorias c ON s.categoria_id = c.id
     LEFT JOIN produto_imagens pi ON p.id = pi.produto_id AND pi.is_principal = TRUE
     LEFT JOIN avaliacoes_produtos a ON p.id = a.produto_id
     WHERE ${where.join(' AND ')}
     GROUP BY p.id, m.nome, v.nome_fantasia, s.nome, c.nome, pi.url
     ORDER BY ${orderBy}
     LIMIT 60
  `;

  const result = await pool.query(query, valores);
  return result.rows;
}

async function buscarBlocosPorId(id) {
  const result = await pool.query(
    `SELECT * FROM produto_descricao_blocos 
     WHERE produto_id = $1 
     ORDER BY ordem ASC`,
    [id]
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

module.exports = { 
  criar, listartodos, buscarPorId, buscarImagensPorId, buscarBlocosPorId, buscarPorModelo,
  buscarPorVendedor, buscarFuzzy, buscarParaCarrossel, buscarPorCategoria,
  buscarEmOferta, buscarRandom, buscarFavoritos, buscarPorEvento,
  buscarPorSubcategoria, buscarComFiltros, atualizar, deletar
};
const pool = require('../config/db');

async function listarTodas() {
  const result = await pool.query('SELECT * FROM categorias ORDER BY nome ASC');
  return result.rows;
}

async function buscarPorId(id) {
  const result = await pool.query('SELECT * FROM categorias WHERE id = $1', [id]);
  return result.rows[0];
}

async function criar(nome) {
  const result = await pool.query(
    'INSERT INTO categorias (nome) VALUES ($1) RETURNING *',
    [nome]
  );
  return result.rows[0];
}

async function buscarSubcategorias(categoriaId) {
  const result = await pool.query(
    'SELECT * FROM subcategorias WHERE categoria_id = $1 ORDER BY nome ASC',
    [categoriaId]
  );
  return result.rows;
}

async function criarSubcategoria(categoria_id, nome) {
  const result = await pool.query(
    'INSERT INTO subcategorias (categoria_id, nome) VALUES ($1, $2) RETURNING *',
    [categoria_id, nome]
  );
  return result.rows[0];
}

async function listarCategoriasComSub() {
  const query = `
    SELECT 
      c.id AS categoria_id, 
      c.nome AS categoria_nome, 
      s.id AS subcategoria_id, 
      s.nome AS subcategoria_nome
    FROM categorias c
    LEFT JOIN subcategorias s ON c.id = s.categoria_id
    ORDER BY c.nome, s.nome;
  `;
  const result = await pool.query(query);
  return result.rows;
}

async function deletar(id) {
  const result = await pool.query('DELETE FROM categorias WHERE id = $1', [id]);
  return result.rowCount > 0;
}

module.exports = { 
  listarTodas, 
  buscarPorId,
  criar,
  buscarSubcategorias, 
  criarSubcategoria,
  listarCategoriasComSub,
  deletar
};
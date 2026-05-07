const pool = require('../config/db');

async function criar(vendedor_id, dados) {
  const { cep, rua, numero, complemento, bairro, cidade, estado } = dados;
  const result = await pool.query(
    `INSERT INTO enderecos_vendedor (vendedor_id, cep, rua, numero, complemento, bairro, cidade, estado)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [vendedor_id, cep, rua, numero, complemento, bairro, cidade, estado]
  );
  return result.rows[0];
}

async function buscarPorVendedor(vendedor_id) {
  const result = await pool.query(
    `SELECT * FROM enderecos_vendedor WHERE vendedor_id = $1`,
    [vendedor_id]
  );
  return result.rows[0];
}

async function atualizar(vendedor_id, dados) {
  const { cep, rua, numero, complemento, bairro, cidade, estado } = dados;
  const result = await pool.query(
    `UPDATE enderecos_vendedor SET cep=$1, rua=$2, numero=$3, complemento=$4,
     bairro=$5, cidade=$6, estado=$7
     WHERE vendedor_id=$8 RETURNING *`,
    [cep, rua, numero, complemento, bairro, cidade, estado, vendedor_id]
  );
  return result.rows[0];
}

async function deletar(vendedor_id) {
  const result = await pool.query(
    `DELETE FROM enderecos_vendedor WHERE vendedor_id=$1 RETURNING *`,
    [vendedor_id]
  );
  return result.rows[0];
}

module.exports = { criar, buscarPorVendedor, atualizar, deletar };
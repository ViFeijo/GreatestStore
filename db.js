require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // necessário para o Supabase
});

module.exports = pool;
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.log('Erro ao conectar:', err);
  } else {
    console.log('Conectado ao Supabase!', res.rows);
  }
});
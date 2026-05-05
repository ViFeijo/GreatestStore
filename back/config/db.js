const { Pool } = require('pg')
require('dotenv').config({ path: './Secret.env' })

const pool = new Pool({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: 5432,
  ssl: { rejectUnauthorized: false }
})

pool.connect((err, client, release) => {
  if (err) {
    console.error('Erro ao conectar no banco:', err.message)
  } else {
    console.log('Banco de dados conectado com sucesso!')
    release()
  }
})

module.exports = pool;
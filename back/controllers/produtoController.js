const pool = require('./db');
const criarProduto= async (req, res)=>{
try{const { vendedor_id, nome, descricao, preco, estoque, imagem_url, FAQ, marca} = req.body;
const result = await pool.query(
    'INSERT INTO produtos (nome, preco,vendedor_id, descricao, estoque, imagem_url, FAQ, marca ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING*',
    [nome, preco, vendedor_id, descricao, estoque,imagem_url, FAQ, marca ]
)
res.status(201).json(result.rows[0]);
} catch (err){
    console.log('Erro:', err);
    res.status(500).json({ erro: err.message })
}}
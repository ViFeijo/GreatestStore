const path = require('path');

require('dotenv').config({ path: path.join(__dirname, 'Secret.env') });
const express = require('express');
const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000,http://localhost:3001')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (
    origin &&
    (allowedOrigins.includes(origin) || /^http:\/\/localhost:\d+$/.test(origin))
  ) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const vendedorRoutes = require('./routes/vendedorRoutes');
const produtoRoutes = require('./routes/produtoRoutes');
const marcaRoutes = require('./routes/marcaRoutes');
const eventoRoutes = require('./routes/eventoRoutes');
const enderecoRoutes = require('./routes/enderecoRoutes');
const enderecoVendedorRoutes = require('./routes/enderecoVendedorRoutes');
const carrinhoRoutes = require('./routes/carrinhoRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const notificacaoRoutes = require('./routes/notificacaoRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const subcategoriaRoutes = require('./routes/subcategoriaRoutes');
const avaliacaoRoutes = require('./routes/avaliacaoRoutes');
const favoritosRoutes = require('./routes/favoritosRoutes');
const pagamentoRoutes = require('./routes/pagamentoRoutes');

app.use('/auth', authRoutes);
app.use('/usuarios', usuarioRoutes);
app.use('/vendedores/endereco', enderecoVendedorRoutes);
app.use('/vendedores', vendedorRoutes);
app.use('/produtos', produtoRoutes);
app.use('/marcas', marcaRoutes);
app.use('/eventos', eventoRoutes);
app.use('/enderecos', enderecoRoutes);
app.use('/carrinho', carrinhoRoutes);
app.use('/pedidos', pedidoRoutes);
app.use('/upload', uploadRoutes);
app.use('/notificacoes', notificacaoRoutes);
app.use('/categorias', categoriaRoutes);
app.use('/subcategorias', subcategoriaRoutes);
app.use('/avaliacoes', avaliacaoRoutes);
app.use('/favoritos', favoritosRoutes);
app.use('/pagamentos', pagamentoRoutes);

const port = process.env.PORT || 3010;

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

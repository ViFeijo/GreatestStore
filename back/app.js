require('dotenv').config({ path: './Secret.env' });
const express = require('express');
const app = express();

app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const vendedorRoutes = require('./routes/vendedorRoutes');
const produtoRoutes = require('./routes/produtoRoutes');
const enderecoRoutes = require('./routes/enderecoRoutes');
const carrinhoRoutes = require('./routes/carrinhoRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const marcaRoutes = require('./routes/marcaRoutes');
const eventoRoutes = require('./routes/eventoRoutes');

app.use('/eventos', eventoRoutes);
app.use('/auth', authRoutes);
app.use('/usuarios', usuarioRoutes);
app.use('/vendedores', vendedorRoutes);
app.use('/produtos', produtoRoutes);
app.use('/enderecos', enderecoRoutes);
app.use('/carrinho', carrinhoRoutes);
app.use('/pedidos', pedidoRoutes);
app.use('/upload', uploadRoutes);
app.use('/marcas', marcaRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT}`);
});
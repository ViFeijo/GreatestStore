<<<<<<< HEAD
require('dotenv').config();
<<<<<<< HEAD

<<<<<<< HEAD






=======
=======
>>>>>>> ab0483d (teste)
=======
require('dotenv').config({ path: './Secret.env' });
>>>>>>> e0436dc (feat: estrutura base da API com autenticação de usuário)
const express = require('express');
const app = express();
>>>>>>> eea0b89 (Algumas coisa)

app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const vendedorRoutes = require('./routes/vendedorRoutes');
const produtoRoutes = require('./routes/produtoRoutes');
const enderecoRoutes = require('./routes/enderecoRoutes');
const carrinhoRoutes = require('./routes/carrinhoRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');

app.use('/auth', authRoutes);
app.use('/usuarios', usuarioRoutes);
app.use('/vendedores', vendedorRoutes);
app.use('/produtos', produtoRoutes);
app.use('/enderecos', enderecoRoutes);
app.use('/carrinho', carrinhoRoutes);
app.use('/pedidos', pedidoRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT}`);
});
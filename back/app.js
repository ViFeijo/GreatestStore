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

app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT}`);
});
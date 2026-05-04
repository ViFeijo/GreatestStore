require('dotenv').config({ path: './Secret.env' });
const express = require('express');
const app = express();

app.use(express.json());

const usuarioRoutes = require('./routes/usuarioRoutes');
const produtoRoutes = require('./routes/produtoRoutes');

app.use('/usuarios', usuarioRoutes);
app.use('/produtos', produtoRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT}`);
});
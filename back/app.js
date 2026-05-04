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

const usuarioRoutes = require('./routes/usuarioRoutes');
const produtoRoutes = require('./routes/produtoRoutes');

app.use('/usuarios', usuarioRoutes);
app.use('/produtos', produtoRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT}`);
});
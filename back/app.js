require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());
app.use('/usuarios', require('./routes/usuariorote'));
app.use('/produtos', require('./routes/produtoRoutes'));

app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());
app.use('/usuarios', require('./routes/usuariorote'));
app.use('/produtos', require('./routes/produtoRoutes'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

//import (ES Modules) uso 
// Dentro de supabaseClient.js ou onde você configurou o Supabase
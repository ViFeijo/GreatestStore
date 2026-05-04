require('dotenv').config();
<<<<<<< HEAD

<<<<<<< HEAD






=======
=======
>>>>>>> ab0483d (teste)
const express = require('express');
const app = express();
>>>>>>> eea0b89 (Algumas coisa)

app.use(express.json());
app.use('/usuarios', require('./routes/usuariorote'));
app.use('/produtos', require('./routes/produtoRoutes'));

app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
require('dotenv').config();

<<<<<<< HEAD






=======
const express = require('express');
const app = express();
>>>>>>> eea0b89 (Algumas coisa)

app.use(express.json());

app.use('/usuarios', require('./routes/usuarioRoutes'));

app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
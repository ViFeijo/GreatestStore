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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
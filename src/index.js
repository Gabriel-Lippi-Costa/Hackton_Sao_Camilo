const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const conexao = require('./models/db');
const rotasLogin = require('./routes/authenticationRoutes');

// === Middlewares ===
app.use(cors());
app.use(express.json());
app.use('/auth', rotasLogin); // ✅ todas as rotas começam com /auth

// === Conexão ao banco e start do servidor ===
conexao.connect((erro) => {
  if (erro) {
    console.error('Erro ao se conectar no DB', erro);
    return;
  }

  console.log('Conectado ao MySQL com sucesso!');
  app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
});

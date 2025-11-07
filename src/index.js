const express = require('express');
require('dotenv').config();
const app = express();
app.use(express.json());
const conexao = require('./models/db');


conexao.connect((erro) => {
    if (erro) {
        console.error('Erro ao se conectar no DB')
        return;
    }
    app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
    console.log('Conectado ao MySQL com sucesso!')
})
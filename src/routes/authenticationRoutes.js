const express = require('express');
const router = express.Router();
const conexao = require('../models/db'); // ✅ certinho

// === LOGIN CUIDADOR ===
router.post('/login/cuidador', (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Preencha todos os campos!' });
  }

  const sql = 'SELECT * FROM saomaua.Cuidador WHERE email = ? AND senha = ?';
  conexao.query(sql, [email, senha], (erro, resultado) => {
    if (erro) {
      console.error('Erro ao consultar cuidador:', erro);
      return res.status(500).json({ erro: 'Erro ao realizar login' });
    }

    if (resultado.length === 0) {
      return res.status(401).json({ erro: 'E-mail ou senha incorretos!' });
    }

    const usuario = resultado[0];
    res.status(200).json({
      mensagem: 'Login de cuidador realizado com sucesso!',
      tipo: 'cuidador',
      usuario
    });
  });
});

// === LOGIN FUNCIONÁRIO ===
router.post('/login/funcionario', (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Preencha todos os campos!' });
  }

  const sql = 'SELECT * FROM saomaua.Funcionario WHERE email = ? AND senha = ?';
  conexao.query(sql, [email, senha], (erro, resultado) => {
    if (erro) {
      console.error('Erro ao consultar funcionário:', erro);
      return res.status(500).json({ erro: 'Erro ao realizar login' });
    }

    if (resultado.length === 0) {
      return res.status(401).json({ erro: 'E-mail ou senha incorretos!' });
    }

    const funcionario = resultado[0];
    res.status(200).json({
      mensagem: 'Login de funcionário realizado com sucesso!',
      tipo: 'funcionario',
      usuario: funcionario
    });
  });
});

module.exports = router;

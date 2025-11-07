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

router.post('/cadastro', (req, res) => {
    const { nome, telefone, email, senha } = req.body;

    // Verifica campos obrigatórios
    if (!nome || !telefone || !email) {
        return res.status(400).json({ erro: 'Preencha todos os campos obrigatórios!' });
    }

    const sql = `
        INSERT INTO saomaua.Cuidador (nome, email, telefone, senha)
        VALUES (?, ?, ?, ?)
    `;

    conexao.query(sql, [nome, email, telefone, senha || null], (erro, resultado) => {
        if (erro) {
            console.error('Erro ao cadastrar o cuidador: ', erro);
            return res.status(500).json({ erro: 'Erro ao cadastrar cuidador' });
        }

        res.status(201).json({
            mensagem: 'Cuidador cadastrado com sucesso!',
            id: resultado.insertId,
            cuidador: {
                cuidador_id: resultado.insertId,
                nome: nome,
                email: email,
                telefone: telefone,
                senha: senha || null
            }
        });
    });
});

router.post('/cadastro-funcionario', (req, res) => {
    const { nome, email, telefone, senha} = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ erro: 'Preencha todos os campos obrigatórios!' });
    }

    const sql = `
        INSERT INTO saomaua.Funcionario (nome, email, telefone, senha)
        VALUES (?, ?, ?, ?)
    `;

    conexao.query(
        sql, 
        [nome, email, telefone || null, senha, is_admin ? 1 : 0], 
        (erro, resultado) => {
            if (erro) {
                console.error('Erro ao cadastrar o funcionário: ', erro);
                return res.status(500).json({ erro: 'Erro ao cadastrar funcionário' });
            }

            res.status(201).json({
                mensagem: 'Funcionário cadastrado com sucesso!',
                id: resultado.insertId,
                funcionario: {
                    funcionario_id: resultado.insertId,
                    nome: nome,
                    email: email,
                    telefone: telefone || null,
                }
            });
        }
    );
});

module.exports = router;

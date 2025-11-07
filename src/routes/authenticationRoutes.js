const express = require('express');
const router = express.Router();
const conexao = require('../models/db');

// === LOGIN CUIDADOR ===
router.post('/login/cuidador', (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha)
    return res.status(400).json({ erro: 'Preencha todos os campos!' });

  const sql = 'SELECT * FROM saomaua.Cuidador WHERE email = ? AND senha = ?';
  conexao.query(sql, [email, senha], (erro, resultado) => {
    if (erro) {
      console.error('Erro ao consultar cuidador:', erro);
      return res.status(500).json({ erro: 'Erro ao realizar login' });
    }

    if (resultado.length === 0)
      return res.status(401).json({ erro: 'E-mail ou senha incorretos!' });

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

  if (!email || !senha)
    return res.status(400).json({ erro: 'Preencha todos os campos!' });

  const sql = 'SELECT * FROM saomaua.Funcionario WHERE email = ? AND senha = ?';
  conexao.query(sql, [email, senha], (erro, resultado) => {
    if (erro) {
      console.error('Erro ao consultar funcionário:', erro);
      return res.status(500).json({ erro: 'Erro ao realizar login' });
    }

    if (resultado.length === 0)
      return res.status(401).json({ erro: 'E-mail ou senha incorretos!' });

    const funcionario = resultado[0];
    res.status(200).json({
      mensagem: 'Login de funcionário realizado com sucesso!',
      tipo: 'funcionario',
      usuario: funcionario
    });
  });
});

// === CADASTRO CUIDADOR ===
router.post('/cadastro', (req, res) => {
  const { nome, telefone, email, senha } = req.body;

  if (!nome || !telefone || !email)
    return res.status(400).json({ erro: 'Preencha todos os campos obrigatórios!' });

  const sql = `
    INSERT INTO saomaua.Cuidador (nome, email, telefone, senha)
    VALUES (?, ?, ?, ?)
  `;

  conexao.query(sql, [nome, email, telefone, senha || null], (erro, resultado) => {
    if (erro) {
      console.error('Erro ao cadastrar o cuidador:', erro);
      return res.status(500).json({ erro: 'Erro ao cadastrar cuidador' });
    }

    res.status(201).json({
      mensagem: 'Cuidador cadastrado com sucesso!',
      id: resultado.insertId,
      cuidador: {
        cuidador_id: resultado.insertId,
        nome,
        email,
        telefone,
        senha: senha || null
      }
    });
  });
});

// === CADASTRO FUNCIONÁRIO ===
router.post('/cadastro-funcionario', (req, res) => {
  const { nome, email, telefone, senha } = req.body;

  if (!nome || !email || !senha)
    return res.status(400).json({ erro: 'Preencha todos os campos obrigatórios!' });

  const sql = `
    INSERT INTO saomaua.Funcionario (nome, email, telefone, senha)
    VALUES (?, ?, ?, ?)
  `;

  conexao.query(sql, [nome, email, telefone || null, senha], (erro, resultado) => {
    if (erro) {
      console.error('Erro ao cadastrar o funcionário:', erro);
      return res.status(500).json({ erro: 'Erro ao cadastrar funcionário' });
    }

    res.status(201).json({
      mensagem: 'Funcionário cadastrado com sucesso!',
      id: resultado.insertId,
      funcionario: {
        funcionario_id: resultado.insertId,
        nome,
        email,
        telefone: telefone || null
      }
    });
  });
});

// === CADASTRAR PACIENTE ===
router.post('/pacientes', (req, res) => {
  const { nome, idade, parentesco, cuidador_id, funcionario_id } = req.body;

  if (!nome || !idade || !parentesco || (!cuidador_id && !funcionario_id)) {
    return res.status(400).json({ erro: 'Preencha todos os campos obrigatórios!' });
  }

  // Converter idade em data de nascimento aproximada
  const anoNasc = new Date().getFullYear() - parseInt(idade);
  const data_nascimento = `${anoNasc}-01-01`;

  const sqlPaciente = `
    INSERT INTO saomaua.Paciente (nome, data_nascimento, genero, condicoes_cronicas)
    VALUES (?, ?, 'NAO_INFORMADO', ?)
  `;

  conexao.query(sqlPaciente, [nome, data_nascimento, parentesco], (erroPaciente, resultadoPaciente) => {
    if (erroPaciente) {
      console.error('Erro ao cadastrar paciente:', erroPaciente);
      return res.status(500).json({ erro: 'Erro ao cadastrar paciente' });
    }

    const pacienteId = resultadoPaciente.insertId;

    // Se for cuidador, cria o vínculo
    if (cuidador_id) {
      const sqlVinculo = `
        INSERT INTO saomaua.Paciente_Cuidador (paciente_id, cuidador_id)
        VALUES (?, ?)
      `;
      conexao.query(sqlVinculo, [pacienteId, cuidador_id], (erroVinculo) => {
        if (erroVinculo) {
          console.error('Erro ao vincular paciente ao cuidador:', erroVinculo);
          return res.status(500).json({ erro: 'Erro ao vincular paciente ao cuidador' });
        }

        res.status(201).json({
          mensagem: 'Paciente cadastrado e vinculado ao cuidador com sucesso!',
          paciente_id: pacienteId,
        });
      });
    } else {
      // Caso criado por funcionário, não precisa vínculo
      res.status(201).json({
        mensagem: 'Paciente cadastrado por funcionário com sucesso!',
        paciente_id: pacienteId,
      });
    }
  });
});

// === LISTAR PACIENTES POR CUIDADOR ===
router.get('/pacientes/:cuidador_id', (req, res) => {
  const { cuidador_id } = req.params;

  if (!cuidador_id) {
    return res.status(400).json({ erro: 'ID do cuidador não informado.' });
  }

  const sql = `
    SELECT p.paciente_id, p.nome, p.data_nascimento, p.genero, p.condicoes_cronicas
    FROM saomaua.Paciente p
    JOIN saomaua.Paciente_Cuidador pc ON p.paciente_id = pc.paciente_id
    WHERE pc.cuidador_id = ?
  `;

  conexao.query(sql, [cuidador_id], (erro, resultado) => {
    if (erro) {
      console.error('Erro ao buscar pacientes:', erro);
      return res.status(500).json({ erro: 'Erro ao buscar pacientes' });
    }

    res.status(200).json({ pacientes: resultado });
  });
});

// === DELETAR PACIENTE ===
router.delete('/pacientes/:paciente_id', (req, res) => {
  const { paciente_id } = req.params;

  const sql = 'DELETE FROM saomaua.Paciente WHERE paciente_id = ?';

  conexao.query(sql, [paciente_id], (erro, resultado) => {
    if (erro) {
      console.error('Erro ao deletar paciente:', erro);
      return res.status(500).json({ erro: 'Erro ao excluir paciente' });
    }

    if (resultado.affectedRows === 0)
      return res.status(404).json({ erro: 'Paciente não encontrado' });

    res.status(200).json({ mensagem: 'Paciente excluído com sucesso!' });
  });
});

module.exports = router;

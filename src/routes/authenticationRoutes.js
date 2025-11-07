const router = require('express').Router();

app.post('/cadastro', (req, res) => {
    const { nome, telefone, email, relacao_paciente } = req.body;

    // Verifica campos obrigatórios
    if (!nome || !telefone || !email) {
        return res.status(400).json({ erro: 'Preencha todos os campos obrigatórios!' });
    }

    const sql = `
        INSERT INTO saomaua.Cuidador (nome, email, telefone, relacao_paciente)
        VALUES (?, ?, ?, ?)
    `;

    conexao.query(sql, [nome, email, telefone, relacao_paciente || null], (erro, resultado) => {
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
                relacao_paciente: relacao_paciente || null
            }
        });
    });
});

app.post('/cadastro-funcionario', (req, res) => {
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

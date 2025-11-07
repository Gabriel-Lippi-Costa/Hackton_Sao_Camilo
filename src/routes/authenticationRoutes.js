const router = require('express').Router();

router.post('/cadastro', (req, res) => {
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

app.post('/login', (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ erro: 'Preencha todos os campos!' });
    }

    const sqlCliente = 'SELECT * FROM clientes WHERE email_cliente = ? AND senha_cliente = ?';
    conexao.query(sqlCliente, [email, senha], (erro, resultadoCliente) => {
        if (erro) {
            console.error('Erro ao consultar cliente: ', erro);
            return res.status(500).json({ erro: 'Erro ao realizar login' });
        }

        if (resultadoCliente.length > 0) {
            const usuario = resultadoCliente[0];
            return res.status(200).json({
                mensagem: 'Login de cliente realizado com sucesso!',
                tipo: 'cliente',
                usuario
            });
        }

        const sqlFuncionario = 'SELECT * FROM funcionarios WHERE email_funcionario = ? AND senha_funcionario = ?';
        conexao.query(sqlFuncionario, [email, senha], (erro2, resultadoFunc) => {
            if (erro2) {
                console.error('Erro ao consultar funcionário: ', erro2);
                return res.status(500).json({ erro: 'Erro ao realizar login' });
            }

            if (resultadoFunc.length === 0) {
                return res.status(401).json({ erro: 'Email ou senha incorretos!' });
            }

            const funcionario = resultadoFunc[0];
            return res.status(200).json({
                mensagem: 'Login de funcionário realizado com sucesso!',
                tipo: 'funcionario',
                usuario: funcionario
            });
        });
    });
});
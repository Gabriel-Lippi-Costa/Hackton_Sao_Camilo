const express = require('express');
const router = express.Router();
const { mockPacientes } = require('../models/mock'); // Importa os dados

/**
 * @route   GET /api/statistics
 * @desc    Retorna os dados dos 3 cartões de estatística.
 */
router.get('/statistics', (req, res) => {
    try {
        const total = mockPacientes.length;
        const alertas = mockPacientes.filter(p => p.status === 'Alerta').length;
        
        // Simula uma taxa de monitoramento.
        const taxa = total > 0 ? Math.floor((total - alertas) / total * 100) : 0; 

        const statistics = {
            totalPacientes: total,
            ativosUltimas24h: total, // Simulando que todos estão ativos
            alertasAtivos: alertas,
            taxaMonitoramento: `${taxa}%`
        };
        
        // Adiciona um pequeno delay para simular o carregamento da rede
        setTimeout(() => {
            res.json(statistics);
        }, 800); // 0.8 segundos de delay

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no Servidor');
    }
});

/**
 * @route   GET /api/patients
 * @desc    Retorna a lista de pacientes, aceitando filtros de query.
 * @query   status (String): "Todos", "Normal", "Alerta"
 * @query   search (String): Termo de busca para o nome
 */
router.get('/patients', (req, res) => {
    try {
        const { status, search } = req.query;

        let pacientesFiltrados = [...mockPacientes]; // Copia a lista original

        // 1. Filtrar por status
        if (status && status !== 'Todos') {
            pacientesFiltrados = pacientesFiltrados.filter(p => p.status === status);
        }

        // 2. Filtrar por nome (search)
        if (search) {
            pacientesFiltrados = pacientesFiltrados.filter(p =>
                p.nome.toLowerCase().includes(search.toLowerCase())
            );
        }

        // 3. Adiciona os campos extras que o frontend espera (ícone e cor)
        const responseData = pacientesFiltrados.map(paciente => ({
            ...paciente, // id, nome, status
            statusIcon: paciente.status === 'Normal' ? 'check_circle' : 'warning',
            statusColor: paciente.status === 'Normal' ? 'text-green-500' : 'text-red-500'
        }));
        
        // Adiciona um pequeno delay
        setTimeout(() => {
            res.json(responseData);
        }, 500); // 0.5 segundos de delay

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no Servidor');
    }
});

// Exporta o router para ser usado no index.js
module.exports = router;
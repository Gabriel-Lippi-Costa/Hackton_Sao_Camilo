document.addEventListener('DOMContentLoaded', () => {

    // --- URL Base da API ---
    // Ajuste se o seu backend rodar em um local diferente
    const API_BASE_URL = 'http://localhost:3001/api';

    // --- Seletores de Elementos ---
    const statTotal = document.getElementById('stat-total-pacientes');
    const statAlertas = document.getElementById('stat-alertas-ativos');
    const statTaxa = document.getElementById('stat-taxa-monitoramento');

    const loaderTotal = document.getElementById('loader-total-pacientes');
    const loaderAlertas = document.getElementById('loader-alertas-ativos');
    const loaderTaxa = document.getElementById('loader-taxa-monitoramento');

    const patientListBody = document.getElementById('patient-list-body');
    const searchInput = document.getElementById('search-input');
    const filterButtons = document.querySelectorAll('.btn-filter');

    const btnSair = document.getElementById('btn-sair');
    const toast = document.getElementById('toast-message');

    const fabHelp = document.getElementById('fab-help');
    const helpModal = document.getElementById('help-modal');
    const closeModal = document.getElementById('close-modal');

    // --- Estado da Aplicação ---
    let currentFilterStatus = 'Todos';
    let currentSearchTerm = '';
    let debounceTimer;

    // --- Funções ---

    /**
     * Função para buscar e renderizar as estatísticas dos cartões.
     */
    async function carregarEstatisticas() {
        // Mostra loaders, esconde dados
        loaderTotal.classList.remove('hidden');
        loaderAlertas.classList.remove('hidden');
        loaderTaxa.classList.remove('hidden');
        statTotal.classList.add('hidden');
        statAlertas.classList.add('hidden');
        statTaxa.classList.add('hidden');

        try {
            const response = await fetch(`${API_BASE_URL}/statistics`);
            if (!response.ok) throw new Error('Falha ao carregar estatísticas');

            const stats = await response.json();

            // Atualiza o HTML dos cartões
            statTotal.innerHTML = `
                <span class="text-4xl font-bold block">${stats.totalPacientes}</span>
                <span class="text-sm text-gray-500">${stats.ativosUltimas24h} ativos nas últimas 24h</span>
            `;
            statAlertas.innerHTML = `
                <span class="text-4xl font-bold block text-red-500">${stats.alertasAtivos}</span>
                <span class="text-sm text-gray-500">Requerem atenção imediata</span>
            `;
            statTaxa.innerHTML = `
                <span class="text-4xl font-bold block text-green-500">${stats.taxaMonitoramento}</span>
                <span class="text-sm text-gray-500">Pacientes com dados recentes</span>
            `;

        } catch (error) {
            console.error('Erro em carregarEstatisticas:', error);
            // Mostrar mensagem de erro nos cartões (opcional)
        } finally {
            // Esconde loaders, mostra dados
            loaderTotal.classList.add('hidden');
            loaderAlertas.classList.add('hidden');
            loaderTaxa.classList.add('hidden');
            statTotal.classList.remove('hidden');
            statAlertas.classList.remove('hidden');
            statTaxa.classList.remove('hidden');
        }
    }

    /**
     * Busca pacientes da API e renderiza a lista.
     */
    async function renderizarPacientes() {
        // Mostra o loader
        patientListBody.innerHTML = `
            <div id="patient-list-loader" class="text-center py-16 flex items-center justify-center">
                <div class="loader-dots flex space-x-2">
                    <div class="w-3 h-3 bg-gray-400 rounded-full"></div>
                    <div class="w-3 h-3 bg-gray-400 rounded-full"></div>
                    <div class="w-3 h-3 bg-gray-400 rounded-full"></div>
                </div>
            </div>`;

        try {
            // Constrói a URL com os parâmetros de query
            const url = new URL(`${API_BASE_URL}/patients`);
            url.searchParams.append('status', currentFilterStatus);
            url.searchParams.append('search', currentSearchTerm);

            const response = await fetch(url);
            if (!response.ok) throw new Error('Falha ao carregar pacientes');

            const pacientes = await response.json();

            // 3. Renderiza o HTML
            if (pacientes.length === 0) {
                patientListBody.innerHTML = `
                    <div class="empty-state text-center py-16 text-gray-500 flex flex-col items-center justify-center">
                        <span class="material-symbols-outlined text-6xl mb-4">sentiment_dissatisfied</span>
                        <p>Nenhum paciente encontrado</p>
                    </div>`;
            } else {
                patientListBody.innerHTML = pacientes.map(paciente => `
                    <div class="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50">
                        <div class="flex items-center space-x-3">
                            <span class="material-symbols-outlined ${paciente.statusColor}">${paciente.statusIcon}</span>
                            <span class="font-medium">${paciente.nome}</span>
                        </div>
                        <span class="text-sm ${paciente.statusColor}">${paciente.status}</span>
                    </div>
                `).join('');
            }

        } catch (error) {
            console.error('Erro em renderizarPacientes:', error);
            patientListBody.innerHTML = `
                <div class="empty-state text-center py-16 text-red-500 flex flex-col items-center justify-center">
                    <span class="material-symbols-outlined text-6xl mb-4">error</span>
                    <p>Falha ao carregar pacientes. Tente novamente.</p>
                </div>`;
        }
    }

    /**
     * Atualiza o visual dos botões de filtro e chama a renderização.
     */
    function atualizarFiltros(clickedButton) {
        currentFilterStatus = clickedButton.dataset.filter;

        filterButtons.forEach(btn => {
            // Reseta todos os botões para o estilo 'inativo'
            btn.classList.remove('bg-gray-800', 'text-white', 'border-gray-800');
            btn.classList.add('bg-white', 'text-gray-700', 'border-gray-300');
        });

        // Aplica o estilo 'ativo' ao botão clicado
        clickedButton.classList.add('bg-gray-800', 'text-white', 'border-gray-800');
        clickedButton.classList.remove('bg-white', 'text-gray-700', 'border-gray-300');

        // Re-renderiza a lista com o novo filtro
        renderizarPacientes();
    }

    /**
     * Mostra uma notificação (toast).
     */
    function showToast(message) {
        toast.textContent = message;
        toast.classList.remove('hidden', 'translate-x-full');

        setTimeout(() => {
            toast.classList.add('translate-x-full');
            setTimeout(() => toast.classList.add('hidden'), 300); // Oculta após a transição
        }, 3000); // Fica visível por 3 segundos
    }

    // --- Event Listeners ---

    // Filtros de Status
    filterButtons.forEach(button => {
        button.addEventListener('click', () => atualizarFiltros(button));
    });

    // Busca por Nome (com Debounce)
    searchInput.addEventListener('input', (e) => {
        currentSearchTerm = e.target.value;

        // Limpa o timer anterior
        clearTimeout(debounceTimer);

        // Cria um novo timer para chamar a API após 500ms
        debounceTimer = setTimeout(() => {
            renderizarPacientes();
        }, 500);
    });

    // Botão Sair
    btnSair.addEventListener('click', () => {
        showToast('Você saiu com sucesso.');
        // Aqui você poderia adicionar lógica de logout, ex: redirecionar
    });

    // Modal de Ajuda
    fabHelp.addEventListener('click', () => {
        helpModal.classList.remove('hidden');
    });
    closeModal.addEventListener('click', () => {
        helpModal.classList.add('hidden');
    });
    // Clicar fora do modal para fechar
    helpModal.addEventListener('click', (e) => {
        if (e.target === helpModal) {
            helpModal.classList.add('hidden');
        }
    });

    // --- Inicialização ---
    // Carrega os dados assim que a página estiver pronta
    carregarEstatisticas();
    renderizarPacientes();
});
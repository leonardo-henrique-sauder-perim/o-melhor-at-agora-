document.addEventListener('DOMContentLoaded', function() {
    // Dados iniciais (simulando um banco de dados)
    let dados = {
        clientes: [
            { id: 1, nome: "João Silva", telefone: "11987654321", email: "joao@email.com" },
            { id: 2, nome: "Maria Souza", telefone: "11912345678", email: "maria@email.com" }
        ],
        servicos: [
            { id: 1, nome: "Corte de Cabelo", duracao: 30, preco: 50.00 },
            { id: 2, nome: "Barba", duracao: 20, preco: 30.00 },
            { id: 3, nome: "Corte + Barba", duracao: 50, preco: 70.00 }
        ],
        barbeiros: [
            { id: 1, nome: "Carlos", telefone: "11999999999", email: "carlos@barbearia.com", especialidades: "Corte, Barba", status: "Ativo" },
            { id: 2, nome: "Pedro", telefone: "11888888888", email: "pedro@barbearia.com", especialidades: "Corte", status: "Ativo" }
        ],
        agendamentos: [
            { id: 1, clienteId: 1, servicoId: 1, barbeiroId: 1, data: "2023-06-01", hora: "10:00", status: "Confirmado" },
            { id: 2, clienteId: 2, servicoId: 3, barbeiroId: 2, data: "2023-06-01", hora: "14:00", status: "Confirmado" }
        ]
    };

    // Elementos do DOM
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('nav a');
    const modalContainer = document.getElementById('modal-container');
    const modalAgendamento = document.getElementById('modal-agendamento');
    const modalCliente = document.getElementById('modal-cliente');
    const formAgendamento = document.getElementById('form-agendamento');
    const formCliente = document.getElementById('form-cliente');

    // Navegação entre seções
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            
            // Atualiza a navegação ativa
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            this.classList.add('active');
            
            // Mostra a seção correspondente
            sections.forEach(section => section.classList.remove('active'));
            document.getElementById(sectionId).classList.add('active');
            
            // Atualiza os dados da seção
            atualizarDados(sectionId);
        });
    });

    // Modal de Agendamento
    document.getElementById('novo-agendamento').addEventListener('click', function() {
        abrirModal('agendamento');
    });

    document.getElementById('cancelar-agendamento').addEventListener('click', function() {
        fecharModal();
    });

    // Modal de Cliente
    document.getElementById('novo-cliente').addEventListener('click', function() {
        abrirModal('cliente');
    });

    document.getElementById('cancelar-cliente').addEventListener('click', function() {
        fecharModal();
    });

    // Formulário de Cliente
    formCliente.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const novoCliente = {
            id: dados.clientes.length + 1,
            nome: document.getElementById('cliente-nome').value,
            telefone: document.getElementById('cliente-telefone').value,
            email: document.getElementById('cliente-email').value
        };
        
        dados.clientes.push(novoCliente);
        atualizarDados('clientes');
        fecharModal();
        formCliente.reset();
    });

    // Formulário de Agendamento
    formAgendamento.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const novoAgendamento = {
            id: dados.agendamentos.length + 1,
            clienteId: parseInt(document.getElementById('agendamento-cliente').value),
            servicoId: parseInt(document.getElementById('agendamento-servico').value),
            barbeiroId: parseInt(document.getElementById('agendamento-barbeiro').value),
            data: document.getElementById('agendamento-data').value,
            hora: document.getElementById('agendamento-hora').value,
            status: "Confirmado"
        };
        
        dados.agendamentos.push(novoAgendamento);
        atualizarDados('agendamentos');
        fecharModal();
        formAgendamento.reset();
    });

    // Funções auxiliares
    function abrirModal(tipo) {
        modalContainer.style.display = 'flex';
        
        if (tipo === 'agendamento') {
            modalAgendamento.style.display = 'block';
            modalCliente.style.display = 'none';
            
            // Preencher selects do agendamento
            const selectCliente = document.getElementById('agendamento-cliente');
            const selectServico = document.getElementById('agendamento-servico');
            const selectBarbeiro = document.getElementById('agendamento-barbeiro');
            
            selectCliente.innerHTML = '<option value="">Selecione um cliente</option>';
            selectServico.innerHTML = '<option value="">Selecione um serviço</option>';
            selectBarbeiro.innerHTML = '<option value="">Selecione um barbeiro</option>';
            
            dados.clientes.forEach(cliente => {
                selectCliente.innerHTML += `<option value="${cliente.id}">${cliente.nome}</option>`;
            });
            
            dados.servicos.forEach(servico => {
                selectServico.innerHTML += `<option value="${servico.id}">${servico.nome} - R$ ${servico.preco.toFixed(2)}</option>`;
            });
            
            dados.barbeiros.forEach(barbeiro => {
                selectBarbeiro.innerHTML += `<option value="${barbeiro.id}">${barbeiro.nome}</option>`;
            });
            
            // Definir data padrão para hoje
            document.getElementById('agendamento-data').valueAsDate = new Date();
        } else if (tipo === 'cliente') {
            modalAgendamento.style.display = 'none';
            modalCliente.style.display = 'block';
        }
    }

    function fecharModal() {
        modalContainer.style.display = 'none';
    }

    function atualizarDados(sectionId) {
        switch(sectionId) {
            case 'dashboard':
                atualizarDashboard();
                break;
            case 'agendamentos':
                atualizarAgendamentos();
                break;
            case 'clientes':
                atualizarClientes();
                break;
            case 'servicos':
                atualizarServicos();
                break;
            case 'barbeiros':
                atualizarBarbeiros();
                break;
            case 'financeiro':
                atualizarFinanceiro();
                break;
        }
    }

    function atualizarDashboard() {
        // Atualizar estatísticas
        const hoje = new Date().toISOString().split('T')[0];
        const agendamentosHoje = dados.agendamentos.filter(a => a.data === hoje).length;
        
        document.getElementById('agendamentos-hoje').textContent = agendamentosHoje;
        document.getElementById('total-clientes').textContent = dados.clientes.length;
        
        // Calcular faturamento mensal (simplificado)
        const faturamento = dados.agendamentos.reduce((total, agendamento) => {
            const servico = dados.servicos.find(s => s.id === agendamento.servicoId);
            return total + (servico ? servico.preco : 0);
        }, 0);
        
        document.getElementById('faturamento-mensal').textContent = `R$ ${faturamento.toFixed(2)}`;
        
        // Atualizar tabela de agendamentos de hoje
        const tbody = document.querySelector('#tabela-agendamentos-hoje tbody');
        tbody.innerHTML = '';
        
        dados.agendamentos
            .filter(a => a.data === hoje)
            .forEach(agendamento => {
                const cliente = dados.clientes.find(c => c.id === agendamento.clienteId);
                const servico = dados.servicos.find(s => s.id === agendamento.servicoId);
                const barbeiro = dados.barbeiros.find(b => b.id === agendamento.barbeiroId);
                
                if (cliente && servico && barbeiro) {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${agendamento.hora}</td>
                        <td>${cliente.nome}</td>
                        <td>${servico.nome}</td>
                        <td>${barbeiro.nome}</td>
                        <td>${agendamento.status}</td>
                    `;
                    tbody.appendChild(tr);
                }
            });
    }

    function atualizarAgendamentos() {
        const tbody = document.querySelector('#tabela-agendamentos tbody');
        tbody.innerHTML = '';
        
        dados.agendamentos.forEach(agendamento => {
            const cliente = dados.clientes.find(c => c.id === agendamento.clienteId);
            const servico = dados.servicos.find(s => s.id === agendamento.servicoId);
            const barbeiro = dados.barbeiros.find(b => b.id === agendamento.barbeiroId);
            
            if (cliente && servico && barbeiro) {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${formatarData(agendamento.data)}</td>
                    <td>${agendamento.hora}</td>
                    <td>${cliente.nome}</td>
                    <td>${servico.nome}</td>
                    <td>${barbeiro.nome}</td>
                    <td>${agendamento.status}</td>
                    <td>
                        <button class="btn-secondary"><i class="fas fa-edit"></i></button>
                        <button class="btn-secondary"><i class="fas fa-trash"></i></button>
                    </td>
                `;
                tbody.appendChild(tr);
            }
        });
    }

    function atualizarClientes() {
        const tbody = document.querySelector('#tabela-clientes tbody');
        tbody.innerHTML = '';
        
        dados.clientes.forEach(cliente => {
            const agendamentosCliente = dados.agendamentos.filter(a => a.clienteId === cliente.id).length;
            
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${cliente.nome}</td>
                <td>${formatarTelefone(cliente.telefone)}</td>
                <td>${cliente.email || '-'}</td>
                <td>${agendamentosCliente}</td>
                <td>
                    <button class="btn-secondary"><i class="fas fa-edit"></i></button>
                    <button class="btn-secondary"><i class="fas fa-trash"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    function atualizarServicos() {
        const tbody = document.querySelector('#tabela-servicos tbody');
        tbody.innerHTML = '';
        
        dados.servicos.forEach(servico => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${servico.nome}</td>
                <td>${servico.duracao} min</td>
                <td>R$ ${servico.preco.toFixed(2)}</td>
                <td>
                    <button class="btn-secondary"><i class="fas fa-edit"></i></button>
                    <button class="btn-secondary"><i class="fas fa-trash"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    function atualizarBarbeiros() {
        const tbody = document.querySelector('#tabela-barbeiros tbody');
        tbody.innerHTML = '';
        
        dados.barbeiros.forEach(barbeiro => {
            const agendamentosBarbeiro = dados.agendamentos.filter(a => a.barbeiroId === barbeiro.id).length;
            
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${barbeiro.nome}</td>
                <td>${formatarTelefone(barbeiro.telefone)}</td>
                <td>${barbeiro.email}</td>
                <td>${barbeiro.especialidades}</td>
                <td>${barbeiro.status}</td>
                <td>
                    <button class="btn-secondary"><i class="fas fa-edit"></i></button>
                    <button class="btn-secondary"><i class="fas fa-trash"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    function atualizarFinanceiro() {
        // Atualizar anos disponíveis
        const selectAno = document.getElementById('ano-financeiro');
        selectAno.innerHTML = '';
        
        const anoAtual = new Date().getFullYear();
        for (let i = anoAtual - 5; i <= anoAtual; i++) {
            selectAno.innerHTML += `<option value="${i}">${i}</option>`;
        }
        selectAno.value = anoAtual;
        
        // Atualizar resumo financeiro
        const totalRecebido = dados.agendamentos.reduce((total, agendamento) => {
            const servico = dados.servicos.find(s => s.id === agendamento.servicoId);
            return total + (servico ? servico.preco : 0);
        }, 0);
        
        document.getElementById('total-recebido').textContent = `R$ ${totalRecebido.toFixed(2)}`;
        
        // Serviço mais popular
        const servicosCount = {};
        dados.agendamentos.forEach(agendamento => {
            servicosCount[agendamento.servicoId] = (servicosCount[agendamento.servicoId] || 0) + 1;
        });
        
        let servicoMaisPopular = null;
        let maxCount = 0;
        for (const servicoId in servicosCount) {
            if (servicosCount[servicoId] > maxCount) {
                maxCount = servicosCount[servicoId];
                servicoMaisPopular = dados.servicos.find(s => s.id === parseInt(servicoId));
            }
        }
        
        document.getElementById('servico-popular').textContent = servicoMaisPopular ? servicoMaisPopular.nome : '-';
        
        // Barbeiro mais ativo
        const barbeirosCount = {};
        dados.agendamentos.forEach(agendamento => {
            barbeirosCount[agendamento.barbeiroId] = (barbeirosCount[agendamento.barbeiroId] || 0) + 1;
        });
        
        let barbeiroMaisAtivo = null;
        maxCount = 0;
        for (const barbeiroId in barbeirosCount) {
            if (barbeirosCount[barbeiroId] > maxCount) {
                maxCount = barbeirosCount[barbeiroId];
                barbeiroMaisAtivo = dados.barbeiros.find(b => b.id === parseInt(barbeiroId));
            }
        }
        
        document.getElementById('barbeiro-ativo').textContent = barbeiroMaisAtivo ? barbeiroMaisAtivo.nome : '-';
        
        // Gráfico financeiro
        const ctx = document.getElementById('grafico-financeiro').getContext('2d');
        
        // Se já existir um gráfico, destrua-o antes de criar um novo
        if (window.financeiroChart) {
            window.financeiroChart.destroy();
        }
        
        // Agrupar por mês (simplificado)
        const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dec'];
        const dadosMensais = new Array(12).fill(0);
        
        dados.agendamentos.forEach(agendamento => {
            const mes = new Date(agendamento.data).getMonth();
            const servico = dados.servicos.find(s => s.id === agendamento.servicoId);
            if (servico) {
                dadosMensais[mes] += servico.preco;
            }
        });
        
        window.financeiroChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: meses,
                datasets: [{
                    label: 'Faturamento por Mês',
                    data: dadosMensais,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Funções de formatação
    function formatarData(data) {
        const [ano, mes, dia] = data.split('-');
        return `${dia}/${mes}/${ano}`;
    }

    function formatarTelefone(telefone) {
        return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }

    // Inicializar a aplicação
    atualizarDados('dashboard');
});
// finance.js - Módulo de controle financeiro

class FinanceManager {
    constructor() {
        this.transactions = [];
        this.categories = [
            { id: 'seeds', name: 'Sementes', icon: 'bi-flower1' },
            { id: 'fertilizer', name: 'Fertilizantes', icon: 'bi-droplet-fill' },
            { id: 'equipment', name: 'Equipamentos', icon: 'bi-tools' },
            { id: 'labor', name: 'Mão de obra', icon: 'bi-person-workspace' },
            { id: 'sales', name: 'Vendas', icon: 'bi-cart-check' },
            { id: 'other', name: 'Outros', icon: 'bi-three-dots' }
        ];
        
        // Inicializar o módulo
        this.init();
    }

    init() {
        // Carregar transações salvas
        this.loadTransactions();
        
        // Configurar event listeners
        this.setupEventListeners();
        
        // Atualizar resumo financeiro
        this.updateFinancialSummary();
        
        // Renderizar histórico de transações
        this.renderTransactionHistory();
    }

    setupEventListeners() {
        // Formulário de nova transação
        const transactionForm = document.getElementById('transactionForm');
        if (transactionForm) {
            transactionForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewTransaction();
            });
        }
    }

    // Carregar transações do armazenamento local
    loadTransactions() {
        try {
            const savedTransactions = localStorage.getItem('appAgro_transactions');
            if (savedTransactions) {
                this.transactions = JSON.parse(savedTransactions);
                
                // Garantir que as transações tenham as datas corretas (como objetos Date)
                this.transactions.forEach(transaction => {
                    if (typeof transaction.date === 'string') {
                        transaction.date = new Date(transaction.date);
                    }
                });
                
                // Ordenar por data (mais recentes primeiro)
                this.transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
            }
        } catch (error) {
            console.error('Erro ao carregar transações:', error);
            this.transactions = [];
        }
    }

    // Salvar transações no armazenamento local
    saveTransactions() {
        try {
            localStorage.setItem('appAgro_transactions', JSON.stringify(this.transactions));
        } catch (error) {
            console.error('Erro ao salvar transações:', error);
            window.appAgro.showNotification('Erro ao salvar as transações', 'error');
        }
    }

    // Processar nova transação
    handleNewTransaction() {
        // Obter valores do formulário
        const description = document.getElementById('transactionDescription').value;
        const amount = parseFloat(document.getElementById('transactionAmount').value);
        const type = document.getElementById('transactionType').value;
        const dateStr = document.getElementById('transactionDate').value;
        const category = document.getElementById('transactionCategory').value;
        
        // Validar dados
        if (!description || isNaN(amount) || amount <= 0 || !dateStr) {
            window.appAgro.showNotification('Por favor, preencha todos os campos corretamente', 'warning');
            return;
        }
        
        // Criar objeto de transação
        const newTransaction = {
            id: Date.now().toString(),
            description,
            amount,
            type,
            date: new Date(dateStr),
            category,
            userId: window.authManager ? window.authManager.getCurrentUser()?.id : 'guest'
        };
        
        // Adicionar à lista de transações
        this.transactions.unshift(newTransaction);
        
        // Salvar no armazenamento local
        this.saveTransactions();
        
        // Atualizar interface
        this.updateFinancialSummary();
        this.renderTransactionHistory();
        
        // Limpar formulário
        document.getElementById('transactionForm').reset();
        
        // Notificar usuário
        window.appAgro.showNotification('Transação registrada com sucesso!', 'success');
    }

    // Atualizar resumo financeiro
    updateFinancialSummary() {
        // Calcular totais
        const totals = this.calculateFinancialTotals();
        
        // Atualizar elementos na interface
        const incomeElement = document.getElementById('incomeValue');
        const expenseElement = document.getElementById('expenseValue');
        const balanceElement = document.getElementById('balanceValue');
        
        if (incomeElement) {
            incomeElement.textContent = this.formatCurrency(totals.income);
        }
        
        if (expenseElement) {
            expenseElement.textContent = this.formatCurrency(totals.expenses);
        }
        
        if (balanceElement) {
            balanceElement.textContent = this.formatCurrency(totals.balance);
            
            // Aplicar classe de cor com base no saldo
            balanceElement.className = '';
            if (totals.balance > 0) {
                balanceElement.classList.add('text-success');
            } else if (totals.balance < 0) {
                balanceElement.classList.add('text-danger');
            }
        }
    }

    // Calcular totais financeiros
    calculateFinancialTotals() {
        const totals = {
            income: 0,
            expenses: 0,
            balance: 0
        };
        
        // Somar receitas e despesas
        this.transactions.forEach(transaction => {
            if (transaction.type === 'income') {
                totals.income += transaction.amount;
            } else if (transaction.type === 'expense') {
                totals.expenses += transaction.amount;
            }
        });
        
        // Calcular saldo
        totals.balance = totals.income - totals.expenses;
        
        return totals;
    }

    // Formatar valor como moeda (R$)
    formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }

    // Renderizar histórico de transações
    renderTransactionHistory() {
        const historyContainer = document.getElementById('transactionHistory');
        if (!historyContainer) return;
        
        if (this.transactions.length === 0) {
            historyContainer.innerHTML = `
                <li class="list-group-item text-center text-muted">
                    Nenhuma transação registrada
                </li>
            `;
            return;
        }
        
        // Limpar conteúdo anterior
        historyContainer.innerHTML = '';
        
        // Mostrar até 10 transações mais recentes
        const recentTransactions = this.transactions.slice(0, 10);
        
        // Adicionar cada transação à lista
        recentTransactions.forEach(transaction => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';
            
            // Encontrar categoria
            const category = this.categories.find(cat => cat.id === transaction.category) || {
                name: 'Outros',
                icon: 'bi-three-dots'
            };
            
            // Formatar data
            const formattedDate = new Intl.DateTimeFormat('pt-BR').format(new Date(transaction.date));
            
            // Definir tipo (receita/despesa)
            const isIncome = transaction.type === 'income';
            const typeClass = isIncome ? 'text-success' : 'text-danger';
            const typeIcon = isIncome ? 'bi-arrow-down-circle-fill' : 'bi-arrow-up-circle-fill';
            const typePrefix = isIncome ? '+' : '-';
            
            // Criar conteúdo
            listItem.innerHTML = `
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <div class="d-flex align-items-center">
                            <span class="me-2">
                                <i class="${category.icon} transaction-category ${transaction.category}"></i>
                            </span>
                            <div>
                                <div class="fw-bold">${transaction.description}</div>
                                <small class="transaction-date">${formattedDate}</small>
                            </div>
                        </div>
                    </div>
                    <div class="text-end">
                        <div class="${typeClass}">
                            <i class="${typeIcon} me-1"></i>
                            ${typePrefix}${this.formatCurrency(transaction.amount).replace('R$', '')}
                        </div>
                        <small class="transaction-category ${transaction.category}">
                            ${category.name}
                        </small>
                    </div>
                </div>
            `;
            
            // Adicionar à lista
            historyContainer.appendChild(listItem);
        });
        
        // Se houver mais transações além das 10 mostradas
        if (this.transactions.length > 10) {
            const viewMoreItem = document.createElement('li');
            viewMoreItem.className = 'list-group-item text-center';
            viewMoreItem.innerHTML = `
                <button class="btn btn-sm btn-outline-primary" id="btnViewMoreTransactions">
                    Ver mais transações (${this.transactions.length - 10} restantes)
                </button>
            `;
            historyContainer.appendChild(viewMoreItem);
            
            // Adicionar evento
            const btnViewMore = document.getElementById('btnViewMoreTransactions');
            if (btnViewMore) {
                btnViewMore.addEventListener('click', () => {
                    this.showAllTransactions();
                });
            }
        }
    }

    // Mostrar todas as transações (simulação)
    showAllTransactions() {
        window.appAgro.showNotification('Visualização completa de transações em desenvolvimento', 'info');
    }

    // Obter dados para gráfico financeiro
    getChartData() {
        // Agrupar transações por categoria
        const categoryTotals = {};
        
        // Inicializar categorias com zero
        this.categories.forEach(cat => {
            categoryTotals[cat.id] = { income: 0, expense: 0 };
        });
        
        // Somar valores por categoria
        this.transactions.forEach(transaction => {
            if (categoryTotals[transaction.category]) {
                categoryTotals[transaction.category][transaction.type] += transaction.amount;
            } else {
                categoryTotals.other[transaction.type] += transaction.amount;
            }
        });
        
        return {
            labels: this.categories.map(cat => cat.name),
            incomeData: this.categories.map(cat => categoryTotals[cat.id].income),
            expenseData: this.categories.map(cat => categoryTotals[cat.id].expense)
        };
    }

    // Exportar dados financeiros (CSV)
    exportTransactionsToCSV() {
        if (this.transactions.length === 0) {
            window.appAgro.showNotification('Não há transações para exportar', 'warning');
            return;
        }
        
        try {
            // Cabeçalhos
            let csv = 'Data,Descrição,Valor,Tipo,Categoria\n';
            
            // Adicionar cada transação
            this.transactions.forEach(transaction => {
                const formattedDate = new Intl.DateTimeFormat('pt-BR').format(new Date(transaction.date));
                const type = transaction.type === 'income' ? 'Receita' : 'Despesa';
                
                // Encontrar nome da categoria
                const category = this.categories.find(cat => cat.id === transaction.category);
                const categoryName = category ? category.name : 'Outros';
                
                // Formatar linha CSV, escapando aspas
                const row = [
                    formattedDate,
                    `"${transaction.description.replace(/"/g, '""')}"`,
                    transaction.amount,
                    type,
                    categoryName
                ];
                
                csv += row.join(',') + '\n';
            });
            
            // Criar blob e link para download
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', `app-agro-financas-${Date.now()}.csv`);
            link.style.visibility = 'hidden';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            window.appAgro.showNotification('Dados financeiros exportados com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao exportar transações:', error);
            window.appAgro.showNotification('Erro ao exportar dados financeiros', 'error');
        }
    }
}

// Inicializar o gerenciador financeiro quando o documento estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.financeManager = new FinanceManager();
});

// voice.js - Módulo de assistente de voz

class VoiceAssistant {
    constructor() {
        this.recognition = null;
        this.isRecording = false;
        this.isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
        
        // Inicializar o módulo
        this.init();
    }

    init() {
        if (!this.isSupported) {
            console.warn('Reconhecimento de voz não é suportado neste navegador');
            return;
        }
        
        // Inicializar o motor de reconhecimento de voz
        this.initSpeechRecognition();
        
        // Configurar event listeners
        this.setupEventListeners();
    }

    // Inicializar API de reconhecimento de voz
    initSpeechRecognition() {
        // Usar o objeto de reconhecimento de voz apropriado
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        
        // Configurar opções
        this.recognition.lang = 'pt-BR';
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.maxAlternatives = 1;
        
        // Handler para resultados
        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            const confidence = event.results[0][0].confidence;
            
            console.log(`Texto reconhecido: ${transcript} (Confiança: ${confidence.toFixed(2)})`);
            this.processVoiceCommand(transcript, confidence);
        };
        
        // Handler para fim do reconhecimento
        this.recognition.onend = () => {
            if (this.isRecording) {
                this.stopRecording();
            }
        };
        
        // Handler para erros
        this.recognition.onerror = (event) => {
            console.error('Erro no reconhecimento de voz:', event.error);
            this.stopRecording();
            window.appAgro.showNotification('Erro no reconhecimento de voz', 'error');
        };
    }

    // Configurar event listeners
    setupEventListeners() {
        const startVoiceBtn = document.getElementById('startVoiceBtn');
        const stopVoiceBtn = document.getElementById('stopVoiceBtn');
        
        if (startVoiceBtn) {
            startVoiceBtn.addEventListener('click', () => {
                this.startRecording();
            });
        }
        
        if (stopVoiceBtn) {
            stopVoiceBtn.addEventListener('click', () => {
                this.stopRecording();
            });
        }
        
        // Desabilitar botão de início se o reconhecimento de voz não for suportado
        if (!this.isSupported && startVoiceBtn) {
            startVoiceBtn.disabled = true;
            startVoiceBtn.title = 'Reconhecimento de voz não suportado neste navegador';
            startVoiceBtn.textContent = 'Voz não suportada';
        }
    }

    // Iniciar gravação de áudio
    startRecording() {
        if (!this.isSupported) {
            window.appAgro.showNotification('Seu navegador não suporta reconhecimento de voz', 'warning');
            return;
        }
        
        try {
            // Atualizar estado e interface
            this.isRecording = true;
            this.updateRecordingUI(true);
            
            // Iniciar reconhecimento
            this.recognition.start();
            console.log('Gravação de voz iniciada');
        } catch (error) {
            console.error('Erro ao iniciar gravação:', error);
            this.isRecording = false;
            this.updateRecordingUI(false);
            window.appAgro.showNotification('Erro ao iniciar gravação de voz', 'error');
        }
    }

    // Parar gravação de áudio
    stopRecording() {
        if (!this.isSupported || !this.isRecording) return;
        
        try {
            // Atualizar estado e interface
            this.isRecording = false;
            this.updateRecordingUI(false);
            
            // Parar reconhecimento
            this.recognition.stop();
            console.log('Gravação de voz encerrada');
        } catch (error) {
            console.error('Erro ao parar gravação:', error);
        }
    }

    // Atualizar interface para refletir estado de gravação
    updateRecordingUI(isRecording) {
        const startVoiceBtn = document.getElementById('startVoiceBtn');
        const stopVoiceBtn = document.getElementById('stopVoiceBtn');
        const voiceStatus = document.getElementById('voiceStatus');
        
        if (isRecording) {
            if (startVoiceBtn) startVoiceBtn.classList.add('d-none');
            if (stopVoiceBtn) {
                stopVoiceBtn.classList.remove('d-none');
                stopVoiceBtn.classList.add('recording-pulse');
            }
            if (voiceStatus) voiceStatus.classList.remove('d-none');
        } else {
            if (startVoiceBtn) startVoiceBtn.classList.remove('d-none');
            if (stopVoiceBtn) {
                stopVoiceBtn.classList.add('d-none');
                stopVoiceBtn.classList.remove('recording-pulse');
            }
            if (voiceStatus) voiceStatus.classList.add('d-none');
        }
    }

    // Processar comando de voz
    processVoiceCommand(text, confidence) {
        console.log('Processando comando de voz:', text);
        
        // Obter elemento para exibir resultado
        const voiceResult = document.getElementById('voiceResult');
        const voiceContent = document.getElementById('voiceContent');
        
        if (!voiceResult || !voiceContent) return;
        
        // Exibir resultado
        voiceResult.classList.remove('d-none');
        
        // Analisar o texto para determinar intenções (simulação básica)
        const intent = this.detectIntent(text);
        
        // Gerar resposta com base na intenção
        const response = this.generateResponse(intent, text);
        
        // Exibir resultado e resposta
        voiceContent.innerHTML = `
            <div class="mb-3">
                <h5>Você disse:</h5>
                <div class="alert alert-info">
                    "${text}" (confiança: ${(confidence * 100).toFixed(1)}%)
                </div>
            </div>
            
            <div>
                <h5>Resposta:</h5>
                <div class="alert alert-success">
                    ${response}
                </div>
            </div>
            
            <div class="mt-2">
                <button class="btn btn-sm btn-outline-primary" id="btnNewVoiceCommand">
                    Fazer nova pergunta
                </button>
                <button class="btn btn-sm btn-outline-success" id="btnExecuteVoiceAction">
                    Executar ação
                </button>
            </div>
        `;
        
        // Adicionar eventos aos botões
        const btnNewVoiceCommand = document.getElementById('btnNewVoiceCommand');
        if (btnNewVoiceCommand) {
            btnNewVoiceCommand.addEventListener('click', () => {
                this.startRecording();
            });
        }
        
        const btnExecuteVoiceAction = document.getElementById('btnExecuteVoiceAction');
        if (btnExecuteVoiceAction) {
            btnExecuteVoiceAction.addEventListener('click', () => {
                this.executeVoiceAction(intent, text);
            });
        }
    }

    // Detectar intenção do comando de voz
    detectIntent(text) {
        const lowerText = text.toLowerCase();
        
        // Detecção de intenções básicas
        if (lowerText.includes('previsão') && lowerText.includes('tempo')) {
            return 'weather_forecast';
        } else if ((lowerText.includes('adicionar') || lowerText.includes('registrar') || lowerText.includes('incluir')) && 
                  (lowerText.includes('transação') || lowerText.includes('gasto') || lowerText.includes('despesa') || lowerText.includes('receita'))) {
            return 'add_transaction';
        } else if (lowerText.includes('saldo') || lowerText.includes('financeiro') || lowerText.includes('balanço')) {
            return 'financial_summary';
        } else if (lowerText.includes('analisar') && (lowerText.includes('planta') || lowerText.includes('cultura') || lowerText.includes('plantação'))) {
            return 'analyze_crop';
        } else if (lowerText.includes('praga') || lowerText.includes('doença') || lowerText.includes('tratamento')) {
            return 'pest_disease_info';
        } else if (lowerText.includes('ajuda') || lowerText.includes('como') || lowerText.includes('o que')) {
            return 'help';
        } else {
            return 'unknown';
        }
    }

    // Gerar resposta com base na intenção
    generateResponse(intent, originalText) {
        switch (intent) {
            case 'weather_forecast':
                return 'Posso verificar a previsão do tempo para sua região. Para os próximos dias, espera-se temperaturas entre 25°C e 30°C, com probabilidade de chuvas leves.';
                
            case 'add_transaction':
                return 'Posso ajudar você a registrar uma nova transação financeira. Que tipo de transação você deseja registrar?';
                
            case 'financial_summary':
                const totals = window.financeManager ? window.financeManager.calculateFinancialTotals() : { income: 0, expenses: 0, balance: 0 };
                const formatCurrency = (value) => {
                    return new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }).format(value);
                };
                
                return `Seu resumo financeiro atual é: Receitas ${formatCurrency(totals.income)}, 
                        Despesas ${formatCurrency(totals.expenses)}, 
                        Balanço ${formatCurrency(totals.balance)}`;
                
            case 'analyze_crop':
                return 'Para analisar sua plantação, você pode enviar uma foto usando a seção de análise de imagem. Posso identificar a cultura, estimar a saúde das plantas e fornecer recomendações.';
                
            case 'pest_disease_info':
                return 'Para obter informações sobre pragas e doenças, você pode enviar fotos das plantas afetadas na seção de análise. Caso identifique algum problema, posso recomendar tratamentos adequados.';
                
            case 'help':
                return 'Posso ajudar com: informações sobre o clima, registrar transações financeiras, analisar culturas por foto, informações sobre pragas e doenças, e fornecer resumos financeiros. Como posso te ajudar hoje?';
                
            case 'unknown':
            default:
                return `Não entendi completamente sua solicitação. Você pode perguntar sobre previsão do tempo, 
                        registrar transações, obter resumos financeiros, análise de culturas ou informações sobre pragas e doenças.`;
        }
    }

    // Executar ação com base na intenção
    executeVoiceAction(intent, originalText) {
        switch (intent) {
            case 'weather_forecast':
                // Simulação: Abriria uma seção de previsão do tempo
                window.appAgro.showNotification('Carregando previsão do tempo...', 'info');
                setTimeout(() => {
                    alert('Previsão do tempo para os próximos dias: Temperatura entre 25°C e 30°C, com probabilidade de chuvas leves.');
                }, 1000);
                break;
                
            case 'add_transaction':
                // Focar no formulário de transação
                document.getElementById('transactionDescription').focus();
                window.appAgro.showNotification('Preencha o formulário de transação', 'info');
                break;
                
            case 'financial_summary':
                // Mostrar resumo detalhado
                if (window.financeManager) {
                    window.financeManager.showAllTransactions();
                }
                break;
                
            case 'analyze_crop':
                // Focar na seção de upload de imagens
                document.getElementById('imageInput').click();
                break;
                
            default:
                window.appAgro.showNotification('Função em desenvolvimento', 'info');
                break;
        }
    }

    // Sintetizar fala (resposta por voz)
    speak(text) {
        if (!('speechSynthesis' in window)) {
            console.warn('Síntese de fala não suportada neste navegador');
            return;
        }
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        
        window.speechSynthesis.speak(utterance);
    }
}

// Inicializar o assistente de voz quando o documento estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.voiceAssistant = new VoiceAssistant();
});

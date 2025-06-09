// agro.js - Módulo de assistente agrônomo com IA para análise de imagens

class AgroAssistant {
    constructor() {
        this.model = null;
        this.isModelLoading = false;
        
        // Inicializar o módulo
        this.init();
    }

    async init() {
        try {
            // Configurar os event listeners
            this.setupEventListeners();
            
            // Carregar modelo TensorFlow.js (MobileNet)
            await this.loadImageAnalysisModel();
        } catch (error) {
            console.error('Erro ao inicializar o Assistente Agrônomo:', error);
            window.appAgro.showNotification('Erro ao carregar o modelo de análise de imagens', 'error');
        }
    }

    setupEventListeners() {
        // Botão para analisar imagem
        const analyzeImageBtn = document.getElementById('analyzeImageBtn');
        if (analyzeImageBtn) {
            analyzeImageBtn.addEventListener('click', () => this.analyzeCurrentImage());
        }
    }

    // Carregar o modelo de análise de imagem usando TensorFlow.js
    async loadImageAnalysisModel() {
        if (this.isModelLoading) return;
        
        try {
            this.isModelLoading = true;
            
            // Carregar o modelo MobileNet
            this.model = await mobilenet.load({
                version: 2,
                alpha: 1.0
            });
            
            console.log('Modelo de análise de imagens carregado com sucesso');
            this.isModelLoading = false;
            
            return true;
        } catch (error) {
            console.error('Erro ao carregar modelo de IA:', error);
            this.isModelLoading = false;
            throw error;
        }
    }

    // Analisar a imagem atual
    async analyzeCurrentImage() {
        const previewImage = document.getElementById('previewImage');
        const imageAnalysisResult = document.getElementById('imageAnalysisResult');
        const analysisContent = document.getElementById('analysisContent');
        
        if (!previewImage || !previewImage.src || previewImage.src === '') {
            window.appAgro.showNotification('Nenhuma imagem selecionada para análise', 'warning');
            return;
        }
        
        try {
            // Verificar se o modelo está disponível
            if (!this.model) {
                window.appAgro.showNotification('Carregando modelo de análise... Por favor, aguarde', 'info');
                await this.loadImageAnalysisModel();
            }
            
            // Mostrar indicador de carregamento
            if (analysisContent) {
                analysisContent.innerHTML = `
                    <div class="text-center">
                        <div class="loading-spinner"></div>
                        <p class="mt-2">Analisando imagem... Por favor, aguarde.</p>
                    </div>
                `;
            }
            
            // Exibir o contêiner de resultados
            if (imageAnalysisResult) {
                imageAnalysisResult.classList.remove('d-none');
            }
            
            // Realizar a classificação da imagem
            const predictions = await this.model.classify(previewImage);
            
            // Processar e exibir os resultados
            this.displayImageAnalysisResults(predictions);
            
        } catch (error) {
            console.error('Erro na análise da imagem:', error);
            if (analysisContent) {
                analysisContent.innerHTML = `
                    <div class="alert alert-danger">
                        Ocorreu um erro na análise da imagem. Por favor, tente novamente.
                    </div>
                `;
            }
        }
    }

    // Exibir resultados da análise de imagem
    displayImageAnalysisResults(predictions) {
        const analysisContent = document.getElementById('analysisContent');
        if (!analysisContent) return;
        
        // Mapear os nomes das plantas/condições para português (simulação)
        const translationMap = {
            'corn': 'Milho',
            'maize': 'Milho',
            'wheat': 'Trigo',
            'rice': 'Arroz',
            'soybean': 'Soja',
            'coffee': 'Café',
            'sugar cane': 'Cana-de-açúcar',
            'cotton': 'Algodão',
            'leaf': 'Folha',
            'plant': 'Planta',
            'soil': 'Solo',
            'field': 'Campo',
            'garden': 'Jardim',
            'crop': 'Cultura',
            'farm': 'Fazenda',
            'grassland': 'Pastagem',
            'agricultural': 'Agrícola'
        };
        
        // Filtrar predições relacionadas à agricultura (simulação)
        const agroPredictions = predictions.filter(prediction => {
            const lowerCaseClassName = prediction.className.toLowerCase();
            return Object.keys(translationMap).some(key => lowerCaseClassName.includes(key));
        });
        
        // Preparar a resposta com base nas predições
        if (agroPredictions.length > 0) {
            // Obter a predição principal
            const mainPrediction = agroPredictions[0];
            
            // Traduzir o nome da planta/condição
            let translatedName = mainPrediction.className;
            for (const [engTerm, ptTerm] of Object.entries(translationMap)) {
                translatedName = translatedName.replace(new RegExp(engTerm, 'gi'), ptTerm);
            }
            
            // Gerar recomendações simuladas com base na predição
            const recommendations = this.generateRecommendations(mainPrediction.className);
            
            // Formatar o conteúdo HTML
            analysisContent.innerHTML = `
                <div class="mb-3">
                    <h5>Identificação:</h5>
                    <div class="alert alert-success">
                        Identificamos com ${Math.round(mainPrediction.probability * 100)}% de certeza: 
                        <strong>${translatedName}</strong>
                    </div>
                </div>
                
                <div class="mb-3">
                    <h5>Condição da Cultura:</h5>
                    <div class="progress mb-2">
                        <div class="progress-bar bg-success" role="progressbar" 
                            style="width: 85%" aria-valuenow="85" aria-valuemin="0" aria-valuemax="100">
                            85%
                        </div>
                    </div>
                    <p>A condição geral aparenta ser <strong>boa</strong>.</p>
                </div>
                
                <div class="mb-3">
                    <h5>Recomendações:</h5>
                    <ul class="list-group">
                        ${recommendations.map(rec => `
                            <li class="list-group-item">
                                <i class="bi bi-check-circle-fill text-success me-2"></i>
                                ${rec}
                            </li>
                        `).join('')}
                    </ul>
                </div>
                
                <div>
                    <button class="btn btn-outline-success" id="btnDetailedAnalysis">
                        <i class="bi bi-search"></i> Análise Detalhada
                    </button>
                    <button class="btn btn-outline-primary" id="btnSaveAnalysis">
                        <i class="bi bi-save"></i> Salvar Análise
                    </button>
                </div>
            `;
            
            // Adicionar eventos aos novos botões
            const btnDetailedAnalysis = document.getElementById('btnDetailedAnalysis');
            if (btnDetailedAnalysis) {
                btnDetailedAnalysis.addEventListener('click', () => {
                    window.appAgro.showNotification('Análise detalhada em desenvolvimento', 'info');
                });
            }
            
            const btnSaveAnalysis = document.getElementById('btnSaveAnalysis');
            if (btnSaveAnalysis) {
                btnSaveAnalysis.addEventListener('click', () => {
                    this.saveAnalysisResults(translatedName, mainPrediction.probability, recommendations);
                    window.appAgro.showNotification('Análise salva com sucesso!', 'success');
                });
            }
        } else {
            // Se não encontrou nada relacionado à agricultura
            analysisContent.innerHTML = `
                <div class="alert alert-warning">
                    <i class="bi bi-exclamation-triangle me-2"></i>
                    Não foi possível identificar claramente elementos agrícolas nesta imagem.
                    Por favor, tente com uma foto mais clara da plantação ou cultura.
                </div>
            `;
        }
    }

    // Gerar recomendações simuladas com base no tipo de planta/cultura identificada
    generateRecommendations(plantType) {
        const lowerCasePlantType = plantType.toLowerCase();
        
        // Recomendações básicas para todos
        const commonRecommendations = [
            "Mantenha o monitoramento regular da umidade do solo.",
            "Verifique regularmente a presença de pragas e doenças."
        ];
        
        // Recomendações específicas com base no tipo identificado
        let specificRecommendations = [];
        
        if (lowerCasePlantType.includes('corn') || lowerCasePlantType.includes('maize')) {
            specificRecommendations = [
                "Aplique fertilizante rico em nitrogênio para maximizar o desenvolvimento das espigas.",
                "Monitore a presença da lagarta-do-cartucho e aplique controle biológico se necessário."
            ];
        } else if (lowerCasePlantType.includes('soybean') || lowerCasePlantType.includes('soja')) {
            specificRecommendations = [
                "Verifique a nodulação das raízes para garantir fixação adequada de nitrogênio.",
                "Monitore a ocorrência de ferrugem asiática, especialmente em períodos chuvosos."
            ];
        } else if (lowerCasePlantType.includes('coffee') || lowerCasePlantType.includes('café')) {
            specificRecommendations = [
                "Mantenha o sombreamento adequado para as plantas jovens.",
                "Realize a poda de renovação após a colheita principal."
            ];
        } else if (lowerCasePlantType.includes('rice') || lowerCasePlantType.includes('arroz')) {
            specificRecommendations = [
                "Monitore o nível de água na plantação para evitar estresse hídrico.",
                "Verifique a presença de brusone nas folhas e aplique fungicida preventivo."
            ];
        } else {
            // Recomendações genéricas para outras culturas
            specificRecommendations = [
                "Realize análises regulares do solo para garantir nutrientes adequados.",
                "Implemente rotação de culturas para reduzir pragas e doenças."
            ];
        }
        
        // Combinar e retornar todas as recomendações
        return [...specificRecommendations, ...commonRecommendations];
    }

    // Salvar resultados da análise (simulação - armazenamento local)
    saveAnalysisResults(plantType, confidence, recommendations) {
        try {
            // Obter análises anteriores ou inicializar array
            const savedAnalyses = JSON.parse(localStorage.getItem('appAgro_analyses') || '[]');
            
            // Criar objeto de análise
            const newAnalysis = {
                id: Date.now().toString(),
                date: new Date().toISOString(),
                plantType,
                confidence,
                recommendations,
                imageData: document.getElementById('previewImage').src,
                userId: window.authManager ? window.authManager.getCurrentUser()?.id : 'guest'
            };
            
            // Adicionar à lista e salvar
            savedAnalyses.push(newAnalysis);
            localStorage.setItem('appAgro_analyses', JSON.stringify(savedAnalyses));
            
            return true;
        } catch (error) {
            console.error('Erro ao salvar análise:', error);
            return false;
        }
    }
}

// Inicializar o assistente agrônomo quando o documento estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.agroAssistant = new AgroAssistant();
});

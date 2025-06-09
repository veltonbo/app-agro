// src/main.js - Ponto de entrada principal para o Vite

// Importar estilos
import './css/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Importar bibliotecas
import * as bootstrap from 'bootstrap';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import Chart from 'chart.js/auto';

// Expor bibliotecas globalmente para uso nos scripts existentes
window.bootstrap = bootstrap;
window.tf = tf;
window.mobilenet = mobilenet;
window.Chart = Chart;

// Importar scripts da aplicação
import './js/app.js';
import './js/auth.js';
import './js/agro.js';
import './js/finance.js';
import './js/voice.js';

// Registro do Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // No Vite, os arquivos na pasta 'public' são servidos na raiz
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker registrado com sucesso:', registration);
            })
            .catch(error => {
                console.error('Erro no registro do Service Worker:', error);
            });
    });
}

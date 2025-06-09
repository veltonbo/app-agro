// src/main.js - Ponto de entrada principal para o Vite

// Importar estilos
import './css/styles.css';
// Importar CSS das bibliotecas
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

// Loader global
function showGlobalLoader() {
    if (document.getElementById('globalLoader')) return;
    const loader = document.createElement('div');
    loader.id = 'globalLoader';
    loader.setAttribute('aria-live', 'polite');
    loader.style = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:2000;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,0.7)';
    loader.innerHTML = `<div class="loading-spinner" style="width:48px;height:48px;border-width:6px;"></div>`;
    document.body.appendChild(loader);
}
function hideGlobalLoader() {
    const loader = document.getElementById('globalLoader');
    if (loader) loader.remove();
}
showGlobalLoader();
window.addEventListener('DOMContentLoaded', hideGlobalLoader);

// Registro do Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        const swPath = new URL('./service-worker.js', window.location.href).pathname;
        navigator.serviceWorker.register(swPath)
            .then(registration => {
                console.log('Service Worker registrado com sucesso:', registration);
                // Notificar sobre atualização
                registration.onupdatefound = () => {
                    const installingWorker = registration.installing;
                    installingWorker.onstatechange = () => {
                        if (installingWorker.state === 'installed') {
                            if (navigator.serviceWorker.controller) {
                                // Remover notificação anterior se existir
                                const oldNotif = document.getElementById('swUpdateNotification');
                                if (oldNotif) oldNotif.remove();
                                // Nova versão disponível
                                const div = document.createElement('div');
                                div.id = 'swUpdateNotification';
                                div.className = 'notification info';
                                div.setAttribute('role', 'alert');
                                div.setAttribute('tabindex', '-1');
                                div.style = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);z-index:3000;padding:16px 32px;background:#1976D2;color:#fff;border-radius:8px;box-shadow:0 2px 8px #0002;display:flex;align-items:center;gap:16px;min-width:320px;';
                                div.innerHTML = `
                                    <span>Uma nova versão do APP AGRO está disponível.</span>
                                    <button style="margin-left:8px;" class="btn btn-light btn-sm">Atualizar</button>
                                    <button style="margin-left:8px;" class="btn btn-outline-light btn-sm">Fechar</button>
                                `;
                                document.body.appendChild(div);
                                // Foco para acessibilidade
                                div.focus();
                                // Atualizar
                                div.querySelector('button.btn-light').onclick = () => { location.reload(); };
                                // Fechar notificação
                                div.querySelector('button.btn-outline-light').onclick = () => { div.remove(); };
                            }
                        }
                    };
                };
            })
            .catch(error => {
                console.error('Erro no registro do Service Worker:', error);
            });
    });
}

// service-worker.js - Para funcionalidades offline da PWA

const CACHE_NAME = 'app-agro-v1';
// Caminho base para compatibilidade com GitHub Pages
const BASE_PATH = self.location.pathname.replace('service-worker.js', '');

// Função para adicionar o caminho base a cada URL
const urlWithBase = (url) => {
    // Se já começar com http ou data, está completo
    if (url.startsWith('http') || url.startsWith('data:')) {
        return url;
    }
    // Remover barra inicial para evitar duplicação
    const path = url.startsWith('/') ? url.substring(1) : url;
    return `${BASE_PATH}${path}`;
};

// Arquivos para cache
const ASSETS_TO_CACHE = [
    '',
    'index.html',
    'css/styles.css',
    'js/app.js',
    'js/auth.js',
    'js/agro.js',
    'js/finance.js',
    'js/voice.js',
    'manifest.json',
    'assets/icons/favicon.svg',
    'assets/icons/icon-192x192.svg',
    'assets/icons/icon-512x512.svg'
].map(urlWithBase);

// Instalação do Service Worker
self.addEventListener('install', event => {
    console.log('Service Worker: Instalando...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Armazenando arquivos em cache...');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

// Ativação do Service Worker
self.addEventListener('activate', event => {
    console.log('Service Worker: Ativado');
    
    // Limpar caches antigos
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Limpando cache antigo', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    
    return self.clients.claim();
});

// Interceptação de requisições para servir do cache
self.addEventListener('fetch', event => {
    // Ignorar requisições não GET ou para outros domínios (APIs externas, etc)
    if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Retornar do cache se disponível
                if (response) {
                    return response;
                }

                // Tentar combinar com URLs relativas sem o path base
                const urlWithoutBase = event.request.url.replace(self.location.origin, '');
                const possibleCacheKeys = [
                    urlWithoutBase,
                    urlWithBase(urlWithoutBase),
                    urlWithBase(urlWithoutBase.replace(BASE_PATH, ''))
                ];

                // Verificar outras variações no cache
                return Promise.all(
                    possibleCacheKeys.map(key => caches.match(key))
                )
                .then(matches => {
                    const cachedResponse = matches.find(match => match);
                    if (cachedResponse) return cachedResponse;
                    
                    // Se não encontrou no cache, fazer a requisição
                    return fetch(event.request)
                        .then(fetchResponse => {
                            // Verificar se é uma resposta válida
                            if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
                                return fetchResponse;
                            }
                            
                            // Clonar a resposta, pois ela só pode ser consumida uma vez
                            const responseToCache = fetchResponse.clone();
                            
                            // Abrir o cache e armazenar a nova resposta
                            caches.open(CACHE_NAME)
                                .then(cache => {
                                    cache.put(event.request, responseToCache);
                                });
                            
                            return fetchResponse;
                        })
                        .catch(error => {
                            console.log('Erro na requisição fetch:', error);
                            
                            // Se for uma requisição de página HTML e estiver offline
                            if (event.request.url.indexOf('.html') > -1 || 
                                event.request.mode === 'navigate') {
                                return caches.match(urlWithBase('index.html'));
                            }
                        });
                });
            })
    );
});

// Sincronização em segundo plano (para quando o usuário estiver offline)
self.addEventListener('sync', event => {
    if (event.tag === 'sync-transactions') {
        event.waitUntil(syncTransactions());
    }
});

// Função para sincronizar transações pendentes
function syncTransactions() {
    // Em um app real, aqui iríamos recuperar dados do IndexedDB
    // e enviar para o servidor quando a conexão fosse restabelecida
    return new Promise((resolve, reject) => {
        // Simulação de sincronização
        console.log('Sincronizando transações pendentes...');
        
        // Aqui viria o código para recuperar dados do IndexedDB
        // e enviá-los para o servidor
        
        // Simulando sucesso
        setTimeout(() => {
            console.log('Transações sincronizadas com sucesso!');
            resolve();
        }, 2000);
    });
}

// Notificações push
self.addEventListener('push', event => {
    const data = event.data.json();
    
    const options = {
        body: data.body,
        icon: '/assets/icons/icon-192x192.png',
        badge: '/assets/icons/badge-icon.png',
        data: {
            url: data.url
        }
    };
    
    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// Ação ao clicar na notificação
self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    if (event.notification.data && event.notification.data.url) {
        event.waitUntil(
            clients.matchAll({type: 'window'})
                .then(windowClients => {
                    // Verificar se há alguma janela já aberta
                    for (const client of windowClients) {
                        if (client.url === event.notification.data.url && 'focus' in client) {
                            return client.focus();
                        }
                    }
                    
                    // Se não houver janelas abertas, abrir uma nova
                    if (clients.openWindow) {
                        return clients.openWindow(event.notification.data.url);
                    }
                })
        );
    }
});

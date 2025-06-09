// app.js - Script principal da aplicação

// Verificar se o navegador suporta Service Workers (necessário para PWA)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Obtém o caminho base para compatibilidade com GitHub Pages
        const basePath = window.location.pathname.replace(/\/[^\/]*$/, '/');
        
        navigator.serviceWorker.register(basePath + 'service-worker.js')
            .then(registration => {
                console.log('Service Worker registrado com sucesso:', registration);
            })
            .catch(error => {
                console.error('Erro no registro do Service Worker:', error);
            });
    });
}

// Classe principal do aplicativo
class AppAgro {
    constructor() {
        this.initApp();
    }

    initApp() {
        // Inicializar componentes da aplicação
        this.initEventListeners();
        this.checkAuthentication();
        
        // Exibir mensagem de boas-vindas
        this.showNotification('Bem-vindo ao APP AGRO!', 'success');
    }

    initEventListeners() {
        // Botão de login
        const btnLogin = document.getElementById('btnLogin');
        if (btnLogin) {
            btnLogin.addEventListener('click', () => {
                this.openLoginModal();
            });
        }
        
        // Links de registro e login nos modais
        const registerLink = document.getElementById('registerLink');
        const loginLink = document.getElementById('loginLink');
        
        if (registerLink) {
            registerLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeLoginModal();
                this.openRegisterModal();
            });
        }
        
        if (loginLink) {
            loginLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeRegisterModal();
                this.openLoginModal();
            });
        }
        
        // Visualização de imagem selecionada
        const imageInput = document.getElementById('imageInput');
        if (imageInput) {
            imageInput.addEventListener('change', (e) => {
                this.handleImageSelection(e);
            });
        }
    }

    // Função para verificar se o usuário está autenticado
    checkAuthentication() {
        const user = localStorage.getItem('appAgro_user');
        if (user) {
            // Usuário está logado
            const userData = JSON.parse(user);
            this.updateUserInterface(userData);
        }
    }

    // Atualizar interface do usuário após login
    updateUserInterface(user) {
        const btnLogin = document.getElementById('btnLogin');
        if (btnLogin) {
            btnLogin.textContent = `Olá, ${user.name}`;
            btnLogin.classList.remove('btn-outline-light');
            btnLogin.classList.add('btn-light');
            
            // Mudar evento de clique para mostrar menu de usuário em vez de modal de login
            btnLogin.removeEventListener('click', this.openLoginModal);
            btnLogin.addEventListener('click', () => {
                // Aqui poderia abrir um dropdown de usuário ou outra ação
                console.log('Usuário já autenticado');
                // Opção de logout
                if (confirm('Deseja sair do APP AGRO?')) {
                    this.logout();
                }
            });
        }
    }

    // Função de logout
    logout() {
        localStorage.removeItem('appAgro_user');
        localStorage.removeItem('appAgro_token');
        
        // Recarregar a página para reiniciar o app
        window.location.reload();
    }

    // Funções de modal
    openLoginModal() {
        const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
        loginModal.show();
    }
    
    closeLoginModal() {
        const loginModalEl = document.getElementById('loginModal');
        const loginModal = bootstrap.Modal.getInstance(loginModalEl);
        if (loginModal) {
            loginModal.hide();
        }
    }
    
    openRegisterModal() {
        const registerModal = new bootstrap.Modal(document.getElementById('registerModal'));
        registerModal.show();
    }
    
    closeRegisterModal() {
        const registerModalEl = document.getElementById('registerModal');
        const registerModal = bootstrap.Modal.getInstance(registerModalEl);
        if (registerModal) {
            registerModal.hide();
        }
    }

    // Função para lidar com a seleção de imagens
    handleImageSelection(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const previewImage = document.getElementById('previewImage');
                const imagePreview = document.getElementById('imagePreview');
                
                if (previewImage && imagePreview) {
                    previewImage.src = e.target.result;
                    imagePreview.classList.remove('d-none');
                }
            };
            reader.readAsDataURL(file);
        }
    }

    // Função para mostrar notificações
    showNotification(message, type = 'info') {
        // Criar elemento de notificação
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Adicionar a notificação ao DOM
        document.body.appendChild(notification);
        
        // Exibir notificação com animação
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Remover notificação após alguns segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Iniciar o aplicativo quando o documento estiver totalmente carregado
document.addEventListener('DOMContentLoaded', () => {
    window.appAgro = new AppAgro();
});

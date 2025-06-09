// auth.js - Gerenciamento de autenticação

class AuthManager {
    constructor() {
        this.initAuthForms();
    }

    initAuthForms() {
        // Inicializar formulários de login e registro
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }
        
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister();
            });
        }
    }

    // Processar tentativa de login
    handleLogin() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Em um ambiente real, isto seria uma chamada à API
        // Por enquanto, simularemos uma autenticação local
        this.simulateApiRequest(() => {
            // Verificar se o usuário existe no localStorage
            const users = JSON.parse(localStorage.getItem('appAgro_users') || '[]');
            const user = users.find(u => u.email === email);
            
            if (user && this.verifyPassword(password, user.password)) {
                // Login bem-sucedido
                this.setLoggedInUser({
                    id: user.id,
                    name: user.name,
                    email: user.email
                });
                
                window.appAgro.showNotification('Login realizado com sucesso!', 'success');
                window.appAgro.closeLoginModal();
                
                // Atualizar interface para usuário logado
                window.appAgro.updateUserInterface(user);
            } else {
                // Login falhou
                window.appAgro.showNotification('Email ou senha incorretos!', 'error');
            }
        });
    }

    // Processar tentativa de registro
    handleRegister() {
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;
        
        // Validar senha
        if (password !== confirmPassword) {
            window.appAgro.showNotification('As senhas não coincidem!', 'error');
            return;
        }
        
        // Simular chamada de API para registro
        this.simulateApiRequest(() => {
            // Verificar se o usuário já existe
            const users = JSON.parse(localStorage.getItem('appAgro_users') || '[]');
            
            if (users.find(u => u.email === email)) {
                window.appAgro.showNotification('Este email já está registrado!', 'error');
                return;
            }
            
            // Criar novo usuário
            const newUser = {
                id: Date.now().toString(),
                name,
                email,
                password: this.hashPassword(password), // Em um app real, usaríamos bcrypt ou similar
                createdAt: new Date().toISOString()
            };
            
            // Salvar usuário
            users.push(newUser);
            localStorage.setItem('appAgro_users', JSON.stringify(users));
            
            // Login automático após registro
            this.setLoggedInUser({
                id: newUser.id,
                name: newUser.name,
                email: newUser.email
            });
            
            window.appAgro.showNotification('Registro concluído com sucesso!', 'success');
            window.appAgro.closeRegisterModal();
            
            // Atualizar interface para usuário logado
            window.appAgro.updateUserInterface(newUser);
        });
    }

    // Simular requisição à API
    simulateApiRequest(callback) {
        // Exibir alguma indicação de carregamento se necessário
        // ...
        
        // Simular latência de rede
        setTimeout(() => {
            callback();
        }, 800);
    }

    // Simular hash de senha (em um app real, usaríamos bcrypt ou similar)
    hashPassword(password) {
        // Isto é apenas uma simulação, não é seguro para uso real!
        return btoa(password + 'salt_value');
    }

    // Verificar senha (simulação)
    verifyPassword(inputPassword, hashedPassword) {
        return btoa(inputPassword + 'salt_value') === hashedPassword;
    }

    // Definir usuário logado
    setLoggedInUser(user) {
        // Armazenar dados do usuário (não incluir a senha!)
        localStorage.setItem('appAgro_user', JSON.stringify(user));
        
        // Gerar token de autenticação (simulação)
        const token = this.generateAuthToken();
        localStorage.setItem('appAgro_token', token);
    }

    // Gerar token JWT simulado
    generateAuthToken() {
        // Em um app real, este token seria gerado pelo servidor
        const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
        const payload = btoa(JSON.stringify({
            sub: Date.now().toString(),
            name: 'APP AGRO User',
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 horas
        }));
        const signature = btoa('simulate_signature');
        
        return `${header}.${payload}.${signature}`;
    }

    // Verificar se o usuário está autenticado
    isAuthenticated() {
        const token = localStorage.getItem('appAgro_token');
        // Em um app real, verificaríamos a validade do token
        return !!token;
    }

    // Obter usuário atual
    getCurrentUser() {
        const userJson = localStorage.getItem('appAgro_user');
        return userJson ? JSON.parse(userJson) : null;
    }
}

// Inicializar o gestor de autenticação quando o documento estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
});

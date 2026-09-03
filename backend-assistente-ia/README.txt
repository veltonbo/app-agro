BACKEND DO ASSISTENTE IA — V12.3

POR QUE EXISTE
O Financeiro do Sítio está no GitHub Pages. A chave da OpenAI NÃO pode ficar no index.html.
Este pequeno Worker guarda a chave com segurança e valida o login Firebase antes de aceitar pedidos.

CONFIGURAÇÃO PELO SITE DA CLOUDFLARE
1. Crie/entre em uma conta Cloudflare e abra Workers & Pages.
2. Crie um Worker chamado financeiro-sitio-ai.
3. Cole o conteúdo de cloudflare-worker.js no editor do Worker e publique.
4. Em Settings > Variables and Secrets, crie um SECRET chamado OPENAI_API_KEY com sua chave da OpenAI.
5. Crie as variáveis:
   ALLOWED_ORIGIN = https://veltonbo.github.io
   FIREBASE_API_KEY = AIzaSyD773S1h91tovlKTPbaeAZbN2o1yxROcOc
   OPENAI_MODEL = gpt-5.6-sol
   OPENAI_TRANSCRIBE_MODEL = gpt-transcribe
6. Copie o endereço que termina em workers.dev.
7. No aplicativo: Perfil > Assistente IA > Configurar. Cole o endereço e toque em Testar conexão.

SEGURANÇA
- A OPENAI_API_KEY fica somente como Secret no Worker.
- O Worker valida o token do Firebase.
- O Worker NÃO possui acesso de escrita ao seu banco.
- A IA retorna uma proposta estruturada. O aplicativo grava no Firebase apenas depois da confirmação (ou em modo automático, se você ativar).

WHATSAPP
A mesma lógica deste backend será reutilizada na próxima etapa para receber mensagens da WhatsApp Cloud API.

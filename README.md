# APP AGRO - Assistente Agrônomo e Financeiro com IA

APP AGRO é uma aplicação web progressiva (PWA) que combina assistência agronômica baseada em inteligência artificial com gestão financeira para produtores rurais. A aplicação utiliza tecnologias modernas para oferecer funcionalidades avançadas, como análise de imagens de culturas, assistente de voz e controle financeiro completo.

## Funcionalidades Principais

### Assistente Agrônomo com IA
- **Análise de Imagens**: Identifica culturas, doenças e pragas através de fotos tiradas pelo usuário.
- **Recomendações Personalizadas**: Fornece orientações específicas para cada tipo de cultura e condição identificada.
- **Histórico de Análises**: Armazena análises anteriores para acompanhamento da evolução das culturas.

### Assistente de Voz
- **Reconhecimento de Comandos**: Interpreta comandos de voz para navegação e operações na aplicação.
- **Consultas por Voz**: Permite obter informações sobre culturas, previsão do tempo e resumos financeiros através de comandos falados.
- **Respostas por Voz**: Fornece respostas audíveis para facilitar o uso em campo.

### Controle Financeiro
- **Registro de Transações**: Permite adicionar receitas e despesas com categorização específica para atividades agrícolas.
- **Análise Financeira**: Apresenta resumos, balanços e gráficos para facilitar o controle financeiro.
- **Exportação de Dados**: Possibilita a exportação das transações em formato CSV para uso em outros sistemas.

## Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript
- **Framework CSS**: Bootstrap 5
- **Bibliotecas JS**: 
  - TensorFlow.js (análise de imagens)
  - Chart.js (gráficos financeiros)
  - Web Speech API (reconhecimento e síntese de voz)
- **PWA**: Service Worker para funcionamento offline
- **Armazenamento**: localStorage (no futuro, será integrado com backend)

## Instalação e Execução

Para executar o APP AGRO localmente:

1. Clone este repositório:
   ```
   git clone https://github.com/seuusuario/app-agro.git
   ```

2. Navegue até o diretório do projeto:
   ```
   cd app-agro
   ```

3. Instale as dependências:
   ```
   npm install
   ```

4. Execute o servidor de desenvolvimento:
   ```
   npm run dev
   ```

5. Acesse `http://localhost:3000` no seu navegador.

Para compilar o projeto para produção:

1. Execute o comando de build:
   ```
   npm run build
   ```

2. Os arquivos compilados estarão disponíveis na pasta `dist`.

3. Para pré-visualizar a versão de produção localmente:
   ```
   npm run preview
   ```

## Hospedagem no GitHub Pages

Para hospedar o APP AGRO no GitHub Pages:

1. Faça fork deste repositório ou crie um novo repositório com estes arquivos.
2. Vá para "Settings" > "Pages" no seu repositório.
3. Selecione a branch `main` como source e clique em "Save".
4. Seu site estará disponível em `https://seuusuario.github.io/app-agro/`.

Para implantar automaticamente no GitHub Pages sempre que houver um push para a branch main:

1. O fluxo de trabalho do GitHub Actions já está configurado no arquivo `.github/workflows/deploy.yml`
2. Quando você fizer push para a branch main, o site será automaticamente implantado
3. Você pode verificar o status da implantação na aba "Actions" do seu repositório

### Configurar domínio personalizado

Se desejar configurar um domínio personalizado:

1. Substitua o domínio no arquivo `CNAME` pelo seu domínio real
2. No seu provedor DNS, configure os registros conforme a documentação do GitHub Pages
3. Em "Settings" > "Pages", insira seu domínio personalizado e clique em "Save"
4. Aguarde a validação do domínio e ative a opção "Enforce HTTPS"

## Próximos Passos

- Integração com API de previsão do tempo
- Backend para armazenamento seguro de dados
- Melhoria nos modelos de análise de imagens para culturas específicas
- Expansão das funcionalidades de voz com mais comandos
- Módulo de planejamento de safra e calendário agrícola

## Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests para melhorar este projeto.

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para mais detalhes.

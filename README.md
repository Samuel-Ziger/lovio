# 🎁 Sistema de Criação de Sites de Presente - Firebase Hosting

Este é um sistema completo para criar sites personalizados de presente com integração Mercado Pago, funcionando 100% no Firebase Hosting.

## 🚀 Funcionalidades

- ✅ **Criação de sites personalizados** com mensagens, datas e planos
- ✅ **Integração Mercado Pago** para pagamentos
- ✅ **Hospedagem gratuita** no Firebase Hosting
- ✅ **Interface moderna** com React e Material-UI
- ✅ **Responsivo** para mobile e desktop
- ✅ **Banco de dados MySQL** para persistência de dados
- ✅ **Sites permanentes** com sistema de expiração por plano

## 📋 Planos Disponíveis

- **Basic**: R$ 19,99 - Site simples (1 ano)
- **Premium**: R$ 39,90 - Site com mais recursos (2 anos)
- **Deluxe**: R$ 59,90 - Site completo (10 anos)

## 🛠️ Tecnologias

- **Frontend**: React + Vite + Material-UI
- **Backend**: Node.js + Express
- **Banco de Dados**: MySQL com Sequelize
- **Containerização**: Docker + Docker Compose
- **Pagamentos**: Mercado Pago
- **Hospedagem**: Firebase Hosting
- **Estilização**: Styled Components + CSS

## 🐳 Configuração do Banco de Dados

### 1. Pré-requisitos
- Docker e Docker Compose instalados
- Node.js (versão 14 ou superior)

### 2. Iniciar o Banco de Dados
```bash
# Iniciar MySQL e phpMyAdmin
npm run db:up

# Verificar logs do MySQL
npm run db:logs

# Testar conexão com o banco
npm run db:test
```

### 3. Acessar phpMyAdmin
- **URL**: http://localhost:8080
- **Usuário**: `namoro_user`
- **Senha**: `namoro123`
- **Banco**: `namoromemoria`

### 4. Comandos Úteis do Banco
```bash
# Parar os containers
npm run db:down

# Reiniciar o banco
npm run db:restart

# Resetar completamente (apaga todos os dados)
npm run db:reset

# Ver logs em tempo real
npm run db:logs
```

### 5. Configurações do Banco
- **Host**: localhost
- **Porta**: 3307 (evita conflito com MySQL local)
- **Database**: namoromemoria
- **Usuário**: namoro_user
- **Senha**: namoro123

## 🚀 Deploy Rápido

### 1. Configuração Inicial
```bash
# Clone o repositório
git clone [URL_DO_REPOSITÓRIO]
cd [NOME_DO_DIRETÓRIO]

# Instale as dependências
npm run install:all

# Inicie o banco de dados
npm run db:up

# Teste a conexão
npm run db:test
```

### 2. Configurar Mercado Pago (Opcional)
Para usar pagamentos reais, edite o arquivo `config/config.js`:

```javascript
mercadoPago: {
  accessToken: 'SUA_CHAVE_ACCESS_TOKEN_AQUI',
  publicKey: 'SUA_CHAVE_PUBLICA_AQUI'
}
```

### 3. Rodar em Desenvolvimento
```bash
# Rodar frontend e backend
npm run dev

# Ou rodar apenas o servidor
npm run dev:server
```

### 4. Deploy
```bash
# Build do projeto
npm run build

# Deploy para Firebase
firebase deploy --only hosting
```

## 🎯 Como Usar

### Para Criar um Site:
1. Acesse: http://localhost:5173
2. Preencha os dados do site (título, mensagem, data)
3. Escolha um plano
4. Faça o pagamento
5. Compartilhe o link do seu site!

### Para Ver um Site Criado:
- Acesse: `http://localhost:5173/site/[nome-do-site]`

## 📁 Estrutura do Projeto

```
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── services/      # Serviços (Mercado Pago)
│   │   └── config/        # Configurações
│   └── dist/              # Build para produção
├── config/                # Configurações do projeto
│   ├── database.js        # Configuração do banco
│   └── config.js          # Configurações gerais
├── models/                # Modelos do Sequelize
│   └── Site.js           # Modelo de Site
├── scripts/               # Scripts utilitários
│   ├── init.sql          # Inicialização do banco
│   └── test-database.js  # Teste de conexão
├── docker-compose.yml     # Configuração Docker
├── postman_collection.json # Coleção Postman para testes
├── firebase.json          # Configuração Firebase
└── package.json           # Dependências do projeto
```

## 🔧 Desenvolvimento Local

```bash
# Instalar dependências
npm run install:all

# Iniciar banco de dados
npm run db:up

# Testar banco de dados
npm run db:test

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 🧪 Testando a API

### Com Postman:
1. Importe o arquivo `postman_collection.json` no Postman
2. Teste as seguintes rotas:
   - `GET /api/health` - Health check da API
   - `GET /api/test` - Teste básico
   - `POST /api/pagamento/preferencia` - Criar preferência de pagamento
   - `GET /api/site/:slug` - Buscar site por slug

### Com cURL:
```bash
# Health check
curl http://localhost:5001/api/health

# Teste da API
curl http://localhost:5001/api/test
```

## 💳 Testando Pagamentos

Para testar sem pagamentos reais, o sistema simula a criação de preferências. Em produção, configure suas credenciais do Mercado Pago.

## 🌐 URLs Importantes

- **Site Principal**: http://localhost:5173
- **Criar Site**: http://localhost:5173
- **phpMyAdmin**: http://localhost:8080
- **API Health**: http://localhost:5001/api/health
- **Exemplo de Site**: http://localhost:5173/site/exemplo-amor

## 🎨 Personalização

### Cores e Tema
Edite o arquivo `client/src/theme.js` para personalizar cores e estilos.

### Componentes
Todos os componentes estão em `client/src/components/` e podem ser facilmente modificados.

## 📱 Responsividade

O site é totalmente responsivo e funciona perfeitamente em:
- 📱 Smartphones
- 📱 Tablets  
- 💻 Desktops

## 🔒 Segurança

- Dados armazenados no banco MySQL
- Validação de dados no backend
- Integração segura com Mercado Pago
- Sistema de expiração automática

## 🚀 Próximos Passos

- [x] Configuração do banco de dados MySQL
- [x] Sistema de sites permanentes
- [ ] Implementar CRUD completo no controller
- [ ] Modificar webhook para salvar no banco
- [ ] Atualizar frontend para usar API
- [ ] Adicionar mais templates de site
- [ ] Integração com redes sociais
- [ ] Sistema de usuários
- [ ] Analytics e métricas

## 📞 Suporte

Para dúvidas ou problemas, abra uma issue no repositório.

---

**Desenvolvido com ❤️ para criar momentos especiais!** 
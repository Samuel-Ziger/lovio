# 💕 Lovio - Sites Personalizados de Presente

Sistema completo para criação de sites personalizados de presente com integração ao Mercado Pago, hospedado no Firebase Hosting, usando React no frontend e Node.js no backend, com banco de dados MySQL via Sequelize.

## 🚀 Status do Projeto

### ✅ Implementado
- ✅ **CRUD Completo** - Todas as operações de banco de dados funcionando
- ✅ **Banco de Dados MySQL** - Configurado e testado
- ✅ **API REST** - Endpoints completos para gerenciamento de sites
- ✅ **Integração Mercado Pago** - Pagamentos funcionando
- ✅ **Sistema de Expiração** - Baseado no plano escolhido
- ✅ **Frontend React** - Interface completa
- ✅ **Docker Compose** - Ambiente de desenvolvimento
- ✅ **Testes Automatizados** - Scripts de teste para API
- ✅ **Integração Frontend-Backend** - Frontend conectado ao backend
- ✅ **Persistência Real** - Sites salvos no banco de dados
- ✅ **Webhook Atualizado** - Sites criados automaticamente após pagamento

### 🔄 Próximos Passos
- 🔄 **Sistema de Renovação** - Renovar sites expirados
- 🔄 **Backup Automático** - Backup do banco de dados
- 🔄 **Monitoramento** - Logs e métricas
- 🔄 **Segurança** - Validações e autenticação
- 🔄 **Upload de Imagens** - Sistema de upload real

## 📋 Funcionalidades

### 🎯 Sites Personalizados
- **Título personalizado** - Nome do site
- **Mensagem especial** - Texto personalizado
- **Data comemorativa** - Data do evento
- **Imagens** - Upload de fotos
- **Emojis** - Seleção de emojis
- **Música** - URL de música de fundo

### 💳 Planos de Pagamento
- **Basic** - R$ 19,99 (1 ano)
- **Premium** - R$ 39,90 (2 anos)
- **Deluxe** - R$ 59,90 (10 anos)

### 🔧 Operações CRUD
- **CREATE** - Criar novo site
- **READ** - Buscar site por slug / Listar sites
- **UPDATE** - Atualizar dados do site
- **DELETE** - Remover site

### 🔗 Integração Frontend-Backend
- **API Service** - Serviço para comunicação com backend
- **Validação de Dados** - Validação no frontend e backend
- **Fallback localStorage** - Funciona offline se API falhar
- **Webhook Inteligente** - Cria sites automaticamente após pagamento

## 🛠️ Tecnologias

### Frontend
- **React** - Framework JavaScript
- **Vite** - Build tool
- **CSS** - Estilização
- **Mercado Pago SDK** - Integração de pagamento
- **API Service** - Comunicação com backend

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **Sequelize** - ORM para MySQL
- **Mercado Pago API** - Processamento de pagamentos

### Banco de Dados
- **MySQL** - Banco de dados relacional
- **Docker** - Containerização
- **phpMyAdmin** - Interface web

### Infraestrutura
- **Firebase Hosting** - Hospedagem
- **Vercel** - Deploy automático
- **Docker Compose** - Orquestração

## 🚀 Instalação e Configuração

### Pré-requisitos
- Node.js 18+
- Docker e Docker Compose
- Git

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd Lovio
```

### 2. Configure as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto:
```env
# URLs
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5002

# Mercado Pago
MERCADO_PAGO_ACCESS_TOKEN=APP_USR-4868459967001491-051003-be2cae39860e8eb714f547165324245f-305462343
MERCADO_PAGO_PUBLIC_KEY=APP_USR-fc533834-0b64-46f1-88ff-f4a610774e2d

# Banco de Dados
DB_HOST=localhost
DB_PORT=3307
DB_NAME=lovio_db
DB_USER=root
DB_PASSWORD=123456
```

### 3. Inicie o banco de dados
```bash
docker-compose up -d
```

### 4. Instale as dependências
```bash
npm install
cd client && npm install
```

### 5. Inicialize o banco de dados
```bash
node scripts/init.sql
```

### 6. Teste a conexão com o banco
```bash
node scripts/test-database.js
```

### 7. Inicie o servidor
```bash
node server.js
```

### 8. Em outro terminal, inicie o frontend
```bash
cd client
npm run dev
```

## 🌐 URLs de Acesso

### Desenvolvimento
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5002/api
- **phpMyAdmin**: http://localhost:8080
  - Usuário: `root`
  - Senha: `123456`

### Produção
- **Frontend**: https://lovio.vercel.app
- **Backend**: https://lovio.vercel.app

## 📡 API Endpoints

### 🔧 Utility
- `GET /api/health` - Health check da API
- `GET /api/test` - Teste da API

### 📝 CRUD Sites
- `POST /api/sites` - Criar site
- `GET /api/site/:slug` - Buscar site por slug
- `GET /api/sites` - Listar todos os sites
- `GET /api/sites/ativos` - Listar sites ativos
- `PUT /api/site/:slug` - Atualizar site
- `DELETE /api/site/:slug` - Deletar site

### 💳 Pagamento
- `POST /api/pagamento/preferencia` - Criar preferência de pagamento
- `POST /api/pagamento/webhook` - Webhook do Mercado Pago

## 🧪 Testes

### Teste Automatizado do CRUD
```bash
node scripts/test-crud.js
```

### Teste de Integração Frontend-Backend
```bash
node scripts/test-integration.js
```

### Teste com Postman
1. Importe a coleção `postman_collection.json`
2. Configure a variável `baseUrl` para `http://localhost:5002/api`
3. Execute os testes

### Teste com cURL
```bash
# Health check
curl http://localhost:5002/api/health

# Criar site
curl -X POST http://localhost:5002/api/sites \
  -H "Content-Type: application/json" \
  -d '{"slug":"teste","nome_site":"Site Teste","plano":"basic","dados_json":{"titulo":"Teste","mensagem":"Mensagem"}}'

# Buscar site
curl http://localhost:5002/api/site/teste

# Listar sites
curl http://localhost:5002/api/sites

# Atualizar site
curl -X PUT http://localhost:5002/api/site/teste \
  -H "Content-Type: application/json" \
  -d '{"nome_site":"Site Atualizado"}'

# Deletar site
curl -X DELETE http://localhost:5002/api/site/teste
```

## 📊 Estrutura do Projeto

```
Lovio/
├── api/                    # API do Firebase Functions
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── pages/          # Páginas
│   │   ├── services/       # Serviços (API e Mercado Pago)
│   │   └── config/         # Configurações
├── config/                 # Configurações do backend
├── controllers/            # Controladores da API
├── models/                 # Modelos Sequelize
├── routes/                 # Rotas da API
├── scripts/                # Scripts utilitários
├── server.js              # Servidor principal
├── docker-compose.yml     # Configuração Docker
└── README.md              # Este arquivo
```

## 🔧 Comandos Úteis

### Docker
```bash
# Iniciar serviços
docker-compose up -d

# Parar serviços
docker-compose down

# Ver logs
docker-compose logs -f

# Acessar MySQL
docker exec -it lovio-mysql mysql -u root -p
```

### Desenvolvimento
```bash
# Instalar dependências
npm install

# Iniciar servidor
node server.js

# Iniciar frontend
cd client && npm run dev

# Build do frontend
cd client && npm run build
```

### Banco de Dados
```bash
# Testar conexão
node scripts/test-database.js

# Inicializar banco
node scripts/init.sql

# Verificar expiração
node scripts/verificarExpiracao.js
```

### Testes
```bash
# Teste CRUD
node scripts/test-crud.js

# Teste de integração
node scripts/test-integration.js
```

## 🔗 Como Funciona a Integração

### 1. Fluxo de Criação de Site
1. **Frontend** - Usuário preenche formulário
2. **localStorage** - Dados salvos temporariamente
3. **Pagamento** - Preferência criada via backend
4. **Mercado Pago** - Processamento do pagamento
5. **Webhook** - Site criado automaticamente no banco
6. **Persistência** - Site fica disponível permanentemente

### 2. Busca de Sites
1. **API** - Primeiro tenta buscar na API
2. **localStorage** - Se não encontrar, busca no localStorage
3. **Fallback** - Sistema funciona offline se necessário

### 3. Validações
- **Frontend** - Validação básica dos dados
- **Backend** - Validação completa e segura
- **Slug único** - Verificação de disponibilidade

## 📈 Próximos Passos

### 1. Sistema de Renovação
- [ ] Notificação de expiração
- [ ] Renovação automática
- [ ] Histórico de renovações

### 2. Upload de Imagens
- [ ] Sistema de upload real
- [ ] CDN para imagens
- [ ] Otimização de imagens

### 3. Backup e Monitoramento
- [ ] Backup automático do banco
- [ ] Logs estruturados
- [ ] Métricas de uso

### 4. Segurança
- [ ] Validação de dados avançada
- [ ] Rate limiting
- [ ] Autenticação de usuários

### 5. Melhorias
- [ ] Cache Redis
- [ ] PWA (Progressive Web App)
- [ ] SEO otimizado

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para suporte, envie um email para [seu-email@exemplo.com] ou abra uma issue no GitHub.

---

**Desenvolvido com 💕 para criar momentos especiais através do Lovio** 
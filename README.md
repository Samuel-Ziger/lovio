# Sistema de Criação de Sites com Pagamento

Este é um sistema que permite criar sites personalizados com diferentes planos e integração com o Mercado Pago para processamento de pagamentos.

## 📋 Passo a Passo Completo

### 1. Preparação do Ambiente
1. Instale o Node.js (versão 14 ou superior)
2. Crie uma conta de desenvolvedor no Mercado Pago
3. Obtenha suas credenciais no painel do Mercado Pago:
   - Access Token
   - Public Key
   - Client ID
   - Client Secret

### 2. Configuração do Projeto
1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITÓRIO]
cd [NOME_DO_DIRETÓRIO]
```

2. Instale as dependências:
```bash
npm install
```

3. Crie o arquivo `.env` na raiz do projeto:
```bash
cp .env.example .env
```

4. Configure o arquivo `.env`:
```bash
cp .env.example .env
```

5. Configure o arquivo `.env`:
```env
PORT=5001
FRONTEND_URL=http://localhost:5173
MERCADO_PAGO_ACCESS_TOKEN=SEU_ACCESS_TOKEN
MERCADO_PAGO_PUBLIC_KEY=SUA_PUBLIC_KEY
MERCADO_PAGO_CLIENT_ID=SEU_CLIENT_ID
MERCADO_PAGO_CLIENT_SECRET=SEU_CLIENT_SECRET
```

### 3. Configuração do Mercado Pago
1. Acesse o painel do Mercado Pago: https://www.mercadopago.com.br/developers/panel/credentials
2. Ative o modo sandbox para testes
3. Copie suas credenciais para o arquivo `.env`
4. Configure as URLs de retorno no arquivo `controllers/siteController.js`

### 4. Executando o Sistema
1. Inicie o servidor:
```bash
npm run dev
```

2. Verifique se o servidor está rodando:
- Acesse: http://localhost:5001/api/health
- Deve retornar: `{ status: "ok" }`

3. Teste a criação de uma preferência:
- Acesse: http://localhost:5173
- Preencha os dados do site
- Selecione um plano
- Clique em "Criar Site"

### 5. Testando Pagamentos
1. Use os cartões de teste:
   - Mastercard: 5031 4332 1540 6351
   - Visa: 4235 6477 2802 5682
   - Data: qualquer data futura
   - CVV: qualquer número de 3 dígitos
   - Nome: qualquer nome
   - CPF: qualquer CPF válido

2. Fluxo de teste:
   - Crie um novo site
   - Selecione o plano Basic (R$ 19,90)
   - Use um cartão de teste
   - Verifique o webhook em: http://localhost:5001/api/pagamento/webhook

### 6. Verificação Final
1. Confirme se as URLs estão corretas:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5001
   - Webhook: http://localhost:5001/api/pagamento/webhook

2. Verifique os logs do servidor para erros
3. Teste todos os planos disponíveis
4. Confirme se os webhooks estão funcionando

## 🚀 Tecnologias Utilizadas

- Node.js
- Express
- React
- Mercado Pago SDK
- MongoDB (opcional)

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- NPM ou Yarn
- Conta no Mercado Pago (conta de desenvolvedor)
- Credenciais do Mercado Pago:
  - Access Token
  - Public Key
  - Client ID
  - Client Secret

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITÓRIO]
cd [NOME_DO_DIRETÓRIO]
```

2. Instale as dependências do backend:
```bash
cd backend
npm install
```

3. Instale as dependências do frontend:
```bash
cd frontend
npm install
```

## ⚙️ Configuração

1. Configure as variáveis de ambiente do backend:
```bash
# Crie um arquivo .env na raiz do backend
cp .env.example .env
```

2. Edite o arquivo `.env` com suas credenciais:
```env
PORT=5001
FRONTEND_URL=http://localhost:5173
MERCADO_PAGO_ACCESS_TOKEN=SEU_ACCESS_TOKEN
MERCADO_PAGO_PUBLIC_KEY=SUA_PUBLIC_KEY
MERCADO_PAGO_CLIENT_ID=SEU_CLIENT_ID
MERCADO_PAGO_CLIENT_SECRET=SEU_CLIENT_SECRET
```

3. Configure as URLs de retorno no arquivo `controllers/siteController.js`:
```javascript
back_urls: {
    success: 'http://localhost:5173/sucesso',
    failure: 'http://localhost:5173/erro',
    pending: 'http://localhost:5173/pendente'
}
```

## 🚀 Executando o Sistema

1. Inicie o backend:
```bash
cd backend
npm run dev
```

2. Em outro terminal, inicie o frontend:
```bash
cd frontend
npm run dev
```

3. Acesse o sistema:
- Frontend: http://localhost:5173
- Backend: http://localhost:5001

## 💳 Testando Pagamentos

1. Use o ambiente sandbox do Mercado Pago para testes:
- Acesse: https://www.mercadopago.com.br/developers/panel/credentials
- Ative o modo sandbox

2. Cartões de teste:
- Mastercard: 5031 4332 1540 6351
- Visa: 4235 6477 2802 5682
- Data de validade: qualquer data futura
- CVV: qualquer número de 3 dígitos
- Nome: qualquer nome
- CPF: qualquer CPF válido

## 📝 Planos Disponíveis

- Basic: R$ 19,90
- Premium: R$ 39,90
- Deluxe: R$ 59,90

## 🔍 Endpoints da API

- `GET /api/health` - Verifica a saúde da API
- `POST /api/pagamento/preferencia` - Cria preferência de pagamento
- `GET /api/pagamento/webhook` - Webhook para notificações do Mercado Pago

## ⚠️ Observações Importantes

1. Certifique-se de que todas as URLs de retorno estão corretamente configuradas
2. Mantenha suas credenciais do Mercado Pago seguras
3. Use o ambiente sandbox para testes
4. Verifique se as portas 5001 e 5173 estão disponíveis

## 🆘 Suporte

Em caso de problemas:
1. Verifique os logs do servidor
2. Confirme se todas as dependências estão instaladas
3. Verifique se as credenciais do Mercado Pago estão corretas
4. Certifique-se de que as URLs de retorno estão acessíveis

## 📄 Licença

Este projeto está sob a licença MIT. 
# Memory IIT - Sistema de Homenagens

Sistema web para criação de páginas personalizadas em homenagem a entes queridos, com recursos como QR Codes, mensagens, imagens e contadores dinâmicos.

## Funcionalidades

- Criação de páginas comemorativas personalizadas
- Geração automática de QR Code
- Contador dinâmico de tempo
- Upload de imagens
- Sistema de mensagens e homenagens
- Temas personalizáveis
- Layout responsivo

## Requisitos

- Node.js 14+
- MongoDB
- NPM ou Yarn

## Instalação

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITÓRIO]
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
- Crie um arquivo `.env` na raiz do projeto
- Adicione as seguintes variáveis:
  ```
  PORT=5000
  MONGODB_URI=mongodb://localhost:27017/memory-iit
  FRONTEND_URL=http://localhost:3000
  ```

4. Inicie o servidor:
```bash
npm run dev
```

## Estrutura do Projeto

```
memory-iit/
├── models/
│   └── Memory.js
├── routes/
│   └── memories.js
├── server.js
├── package.json
└── README.md
```

## API Endpoints

- `POST /api/memories` - Criar nova página de homenagem
- `GET /api/memories/:customUrl` - Buscar página por URL personalizada
- `POST /api/memories/:customUrl/messages` - Adicionar mensagem
- `PATCH /api/memories/:customUrl/theme` - Atualizar tema

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. 
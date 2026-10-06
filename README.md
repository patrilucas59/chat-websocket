# Chat WebSocket

Chat 1:1 em tempo real, com histórico persistente de mensagens e indicador de presença (online/offline), construído com WebSocket nativo (`ws`) no backend e React no frontend.

Projeto de portfólio criado para praticar WebSocket em um nível mais baixo, sem bibliotecas de abstração como Socket.IO: o objetivo é entender como conexões, roteamento de mensagens e presença funcionam de fato.

---

## Funcionalidades

- Conversas individuais (1:1)
- Mensagens em tempo real via WebSocket nativo
- Histórico de mensagens persistente (SQLite)
- Toda mensagem é salva no banco, mesmo que o destinatário esteja offline
- Indicador de presença (online/offline) atualizado em tempo real
- Seleção de usuário na tela inicial, simulando um login

---

## Tecnologias

### Frontend

- React
- Vite
- Tailwind CSS
- Axios
- Material UI Icons
- WebSocket API (nativa do navegador)
- ESLint (com `eslint-plugin-react-hooks`)

### Backend

- Node.js
- Express
- ws (WebSocket nativo/low-level)
- better-sqlite3 (persistência de mensagens)
- cors

---

## Como rodar o projeto

### Backend

```bash
cd backend
npm install
node src/seed.js   # zera o banco e cria os usuários de teste (Usuário 1 e Usuário 2)
npm run dev
```

O servidor sobe em `http://localhost:3333`. As tabelas do SQLite são criadas automaticamente ao iniciar (`src/db.js`).

> **Atenção:** o `seed.js` apaga todas as mensagens e usuários existentes antes de recriar os usuários de teste.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Acesse `http://localhost:5173`.

### Testando a conversa

Abra duas abas do navegador (uma normal e uma anônima) em `http://localhost:5173`, entre como **Usuário 1** em uma e como **Usuário 2** na outra, selecione o outro como contato e troque mensagens. Elas chegam em tempo real, e as bolinhas de presença mudam conforme cada aba abre ou fecha.

---

## Arquitetura

```
chat-websocket/
├── backend/
│   └── src/
│       ├── db.js              # conexão SQLite e criação das tabelas
│       ├── seed.js            # usuários de teste
│       ├── server.js          # Express + servidor HTTP
│       ├── routes/
│       │   ├── usuarios.js    # GET /usuarios
│       │   └── mensagens.js   # GET /mensagens/:userId/:contatoId
│       └── ws/
│           └── wsManager.js   # WebSocketServer, roteamento e presença
└── frontend/
    └── src/
        ├── api/http.js        # instância do Axios
        ├── components/
        │   ├── UserSelect.jsx # tela inicial: "quem é você?"
        │   ├── ContactList.jsx
        │   └── ChatArea.jsx
        └── App.jsx            # estado global e conexão WebSocket
```

### Modelo de dados

| Tabela      | Colunas                                                                 |
| ----------- | ----------------------------------------------------------------------- |
| `usuarios`  | `id`, `nome` (único)                                                    |
| `mensagens` | `id`, `remetente_id` (FK), `destinatario_id` (FK), `conteudo`, `timestamp` |

Há um índice em `mensagens (remetente_id, destinatario_id)` para acelerar a busca do histórico de uma conversa.

### API REST

| Método | Rota                                | Descrição                                                        |
| ------ | ----------------------------------- | ---------------------------------------------------------------- |
| GET    | `/usuarios`                         | Lista os usuários cadastrados (`id`, `nome`)                     |
| GET    | `/mensagens/:userId/:contatoId`     | Histórico da conversa entre dois usuários, nos dois sentidos, em ordem cronológica |

### Protocolo WebSocket

A conexão é aberta em `ws://localhost:3333?userId=<id>`. Sem `userId`, o servidor encerra a conexão com o código `1008`.

**Cliente → servidor**

```json
{ "destinatarioId": 2, "conteudo": "Olá, tudo bem?" }
```

**Servidor → cliente** (o campo `type` diferencia cada tipo de evento)

```json
{ "type": "message", "remetenteId": "1", "conteudo": "Olá, tudo bem?" }
```

```json
{ "type": "online-list", "ids": ["1", "2"] }
```

```json
{ "type": "presence", "userId": "1", "status": "online" }
```

- `message`: mensagem de chat entregue ao destinatário online
- `online-list`: enviada apenas ao usuário que acabou de conectar, com quem já está online
- `presence`: enviada a todos quando alguém conecta (`online`) ou desconecta (`offline`)

---

## Fluxo da aplicação

1. O usuário escolhe quem ele é entre os usuários cadastrados (tela inicial, alimentada por `GET /usuarios`)
2. O frontend abre uma conexão WebSocket com o `userId` escolhido; o servidor registra o socket em um `Map<userId, WebSocket>`, envia a lista de quem está online e avisa os demais que ele entrou
3. Ao selecionar um contato, o frontend busca o histórico da conversa via REST
4. Ao enviar uma mensagem, o backend salva no SQLite e, se o destinatário estiver online, repassa em tempo real
5. Mensagens novas chegam via WebSocket e são adicionadas à conversa aberta
6. Ao desconectar, o servidor remove o socket do `Map` e avisa os demais que o usuário ficou offline

---

## Decisões técnicas

- **WebSocket nativo (`ws`) em vez de Socket.IO**: foco em entender o protocolo e implementar roteamento e presença manualmente
- **Uma única conexão WebSocket por sessão**, mantida no `App.jsx`: a conexão continua aberta ao trocar de contato, em vez de ser recriada a cada conversa
- **Eco local da mensagem enviada**: o servidor não devolve a mensagem ao remetente, então o frontend a adiciona na tela assim que a envia
- **Chaves do `Map` sempre como string**: o `userId` vem da query string da URL, então a busca do destinatário usa `String(destinatarioId)` para não falhar por diferença de tipo
- **Consultas preparadas** (`better-sqlite3`) e `foreign_keys` ativado no SQLite
- **Erros de banco tratados com `try/catch`** no handler de mensagens, para uma falha isolada não derrubar o servidor

---

## Limitações conhecidas

- Sem autenticação: o usuário apenas escolhe entre os usuários já cadastrados
- Não há rota para criar usuários; eles são inseridos pelo `seed.js`
- Sem reconexão automática caso a conexão WebSocket caia

---

## Autor

**Lucas Patrício**

- GitHub: [github.com/patrilucas59](https://github.com/patrilucas59)
- LinkedIn: [linkedin.com/in/lucas-patricio](https://linkedin.com/in/lucas-patricio)
# Chat WebSocket

Chat 1:1 em tempo real, com histórico persistente de mensagens, construído com Websocket (`ws`) no backend.

---

## Tecnologias

### Frontend

- React
- Vite
- Axios
- Websocket API (nativa do navegador)

### Backend

- Node.js
- Express
- ws (Websocket nativo/low-level)
- better-sqlite3 (persistência de mensagens)

---

## Como rodar o projeto

### Backend

```

cd backend
npm install
npm run dev

```

### Frontend

```
cd frontend
npm install
npm run dev

```

---

## Fluxo de aplicação

1. Usuário entra com um nome e escolhe um contato na lista
2. Frontend busca o histórico de mensagens via REST
3. Frontend abre uma conexão WebSocket com o backend
4. Ao enviar uma mensagem, o backend salva no banco e repassa em tempo real para o destinatário (se online)
5. Mensagens novas chegam via WebSocket e são adicionadas à conversa

## Funcionalidades

- Conversas individuais (1:1)
- Histórico de mensagens persistente (SQLite)
- Indicador de usuários online
- Comunicação em tempo real via WebSocket nativo

## Observações

- Sem autenticação complexa: o usuário apenas escolhe um nome ao entrar
- Banco de dados SQLite local, sem dependências externas

## Autor

Lucas Patrício
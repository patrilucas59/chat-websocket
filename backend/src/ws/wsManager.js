import { WebSocketServer } from 'ws';
import { parse } from 'node:url';

const clients = new Map();

export function configurationWebSocket(server) {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (socket, req) => {
    const { query } = parse(req.url, true);
    const userId = query.userId;

    if (!userId) {
      socket.close(1008, 'userId obrigatório');
      return;
    }

    clients.set(userId, socket);
    console.log(`Usuário ${userId} está conectado`);

    socket.on('close', () => {
      clients.delete(userId);
      console.log(`Usuário ${userId} está desconectado`);
    });
  });

  return wss;
}
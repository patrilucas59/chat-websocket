import { WebSocketServer } from 'ws';
import { parse } from 'node:url';
import db from '../db.js';

const clientes = new Map();

const inserirMessagem = db.prepare(`
  INSERT INTO mensagens (remetente_id, destinatario_id, conteudo)
  VALUES (?, ?, ?)
`);

export function configurationWebSocket(server) {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (socket, req) => {
    const { query } = parse(req.url, true);
    const userId = query.userId;

    if (!userId) {
      socket.close(1008, 'userId obrigatório');
      return;
    }

    clientes.set(userId, socket);
    console.log(`Usuário ${userId} está conectado`);

    socket.on('message', (data) => {
      let payload;

      try {
        payload = JSON.parse(data.toString());
      } catch (err) {
        console.log(`Mensagem inválida recebida de ${userId}:`, err.message);
        return;
      }

      const { destinatarioId, conteudo } = payload;

      if (!destinatarioId || !conteudo) {
        console.log(`Mensagem incompleta de ${userId}`);
        return;
      }

      try {
        inserirMessagem.run(userId, destinatarioId, conteudo);
      } catch (err) {
        console.log(`Erro ao salvar mensagem de ${userId} para ${destinatarioId}:`, err.message);
        return;
      }

      const socketDestinatario = clientes.get(destinatarioId);

      if (socketDestinatario && socketDestinatario.readyState === socketDestinatario.OPEN) {
        socketDestinatario.send(JSON.stringify({
          remetenteId: userId,
          conteudo,
        }));
      }
    });

    socket.on('close', () => {
      clientes.delete(userId);
      console.log(`Usuário ${userId} está desconectado`);
    });
  });

  return wss;
}
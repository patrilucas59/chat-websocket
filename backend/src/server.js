import express from 'express';
import cors from 'cors';
import http from 'node:http';
import './db.js';

import { WebSocketServer } from 'ws';

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 3333;
const server = http.createServer(app);

const wss = new WebSocketServer({ server });

wss.on('connection', (socket) => {
  console.log('Novo cliente conectado via WebSocket');

  socket.on('close', () => {
    console.log('Cliente desconectado');
  });
});

server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
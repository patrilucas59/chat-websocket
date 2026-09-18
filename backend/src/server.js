import express from 'express';
import cors from 'cors';
import http from 'node:http';
import './db.js';
import { configurationWebSocket } from './ws/wsManager.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 3333;
const server = http.createServer(app);

configurationWebSocket(server);

server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
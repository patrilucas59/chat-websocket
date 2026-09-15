import Database from 'better-sqlite3';

const db = new Database('database.db');

db.exec(`CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT UNIQUE NOT NULL
)`);

db.exec(`CREATE TABLE IF NOT EXISTS mensagens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  remetente_id INTEGER NOT NULL,
  destinatario_id INTEGER NOT NULL,
  conteudo TEXT NOT NULL,
  timestamp TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (remetente_id) REFERENCES usuarios(id),
  FOREIGN KEY (destinatario_id) REFERENCES usuarios(id)
)`);

export default db;
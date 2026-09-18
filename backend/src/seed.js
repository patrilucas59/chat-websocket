import db from './db.js';

const inserirUsuario = db.prepare(`
  INSERT OR IGNORE INTO usuarios (id, nome) VALUES (?, ?)
`);

inserirUsuario.run(1, 'Lucas');
inserirUsuario.run(2, 'Vida');

console.log('Usuários de teste criados com sucesso!');
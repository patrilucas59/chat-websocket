import db from './db.js';

const novosUsuarios = ['Usuário 1', 'Usuário 2'];

const resetar = db.transaction(() => {
  db.prepare('DELETE FROM mensagens').run();
  db.prepare('DELETE FROM usuarios').run();

  db.prepare("DELETE FROM sqlite_sequence WHERE name IN ('mensagens', 'usuarios')").run();

  const inserirUsuario = db.prepare('INSERT INTO usuarios (nome) VALUES (?)');
  for (const nome of novosUsuarios) {
    inserirUsuario.run(nome);
  }
});

resetar();
console.log('Conversas apagadas e usuários recriados:', novosUsuarios.join(', '));
import { Router } from "express";
import db from '../db.js';

const router = Router();

const buscarHistorico = db.prepare(`
  SELECT * FROM mensagens
  WHERE (remetente_id  = ? AND destinatario_id = ?)
      OR (remetente_id = ? AND destinatario_id = ?)
  ORDER BY timestamp ASC
`);

router.get('/mensagens/:userId/:contatoId', (req, res) => {
  const { userId, contatoId } = req.params;

  try {
    const historico = buscarHistorico.all(userId, contatoId, contatoId, userId);
    res.json(historico);
  } catch (err) {
    console.log('Erro ao buscar o histórico:', err.message);
    res.status(500).json({ erro: 'Erro ao buscar histórico de mensagens' });
  }
});

export default router;
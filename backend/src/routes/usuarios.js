import { Router } from "express";
import db from "../db.js";

const router = Router();

const listaUsuarios = db.prepare(`
  SELECT id, nome FROM usuarios  
`);

router.get('/usuarios', (req, res) => {
  try {
    const usuarios = listaUsuarios.all();
    res.json(usuarios);
  } catch (err) {
    console.log('Erro ao buscar usuários:', err.message);
    res.status(500).json({ erro: 'Erro ao buscar usuários' });
  }
});

export default router;
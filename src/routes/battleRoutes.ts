import { Router } from 'express';
import { startBattleHandler, submitAnswerHandler, saveProgressHandler } from '../controllers/battleController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// ✅ CORREÇÃO FINAL:
// Removemos o 'router.use(authMiddleware)' global do arquivo.
// E voltamos a aplicar o middleware de forma explícita em cada rota.
// Como o authMiddleware agora lida com 'OPTIONS', esta é a forma mais segura e garantida.

// Rota para iniciar uma nova batalha
router.post('/iniciar', authMiddleware, startBattleHandler);

// Rota para enviar a resposta de uma pergunta durante a batalha
router.post('/responder', authMiddleware, submitAnswerHandler);

// Rota para salvar o progresso do personagem
router.post('/salvar-progresso', authMiddleware, saveProgressHandler);

export default router;
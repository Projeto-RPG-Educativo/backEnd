import { Router } from 'express';
import { startBattleHandler, submitAnswerHandler, saveProgressHandler} from '../controllers/battleController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Todas as rotas de batalha exigem que o usuário esteja logado.
// Por isso, aplicamos o authMiddleware em ambas.

// Rota para iniciar uma nova batalha
router.post('/iniciar', authMiddleware, startBattleHandler);

// Rota para enviar a resposta de uma pergunta durante a batalha
router.post('/responder', authMiddleware, submitAnswerHandler);

// Rota para salvar o progresso do personagem
router.post('/salvar-progresso', authMiddleware, saveProgressHandler);

export default router;
import { Router } from 'express';
import { saveGameHandler, listSavesHandler } from '../controllers/saveController';
import { authMiddleware } from '../middleware/authMiddleware';
import { errorMiddleware } from '../middleware/errorMiddleware';

const router = Router();

// Aplica o middleware de autenticação a todas as rotas deste arquivo
router.use(authMiddleware);

// GET /api/saves - Rota para listar os saves do usuário logado
router.get('/', errorMiddleware ,listSavesHandler);

// POST /api/saves - Rota para criar/atualizar um save
router.post('/', errorMiddleware, saveGameHandler);

export default router;
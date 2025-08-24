import { Router } from 'express';
import { getCharacterHandler, saveProgressHandler } from '../controllers/characterController';
import { authMiddleware } from '../middleware/authMiddleware'; // Importe o middleware

const router = Router();

// Aplique o middleware em todas as rotas que precisam de login
router.get('/:id', authMiddleware, getCharacterHandler);
router.post('/save-progress', authMiddleware, saveProgressHandler);

export default router;
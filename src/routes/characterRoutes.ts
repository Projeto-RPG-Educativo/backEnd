import { Router } from 'express';
import { getCharacterHandler, saveProgressHandler, createCharacterHandler } from '../controllers/characterController';
import { authMiddleware } from '../middleware/authMiddleware'; // Importe o middleware

const router = Router();

// Rota para criar um novo personagem (protegida por autenticação)
router.post('/criar', authMiddleware, createCharacterHandler);
// Aplique o middleware em todas as rotas que precisam de login
router.get('/:id', authMiddleware, getCharacterHandler);
router.post('/save-progress', authMiddleware, saveProgressHandler);

export default router;
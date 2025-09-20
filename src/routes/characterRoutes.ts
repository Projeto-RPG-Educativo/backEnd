import { Router } from 'express';
import { getCharacterHandler, saveProgressHandler, createCharacterHandler, getMyCharactersHandler } from '../controllers/characterController';
import { authMiddleware } from '../middleware/authMiddleware'; // Importe o middleware

const router = Router();

// Rota para criar um novo personagem (protegida por autenticação)
router.post('/criar', authMiddleware, createCharacterHandler);
// Rota para buscar os personagens do jogador por id
router.get('/meus-personagens', authMiddleware, getMyCharactersHandler);
// Aplique o middleware em todas as rotas que precisam de login
router.get('/:id', authMiddleware, getCharacterHandler);
router.post('/save-progress', authMiddleware, saveProgressHandler);

export default router;
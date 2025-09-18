import { Router } from 'express';
import { getRandomQuestionHandler } from '../controllers/questionController';

const router = Router();

// Define que uma requisição GET para a URL '/aleatoria'
// deve acionar a nossa função 'getRandomQuestionHandler'.
router.get('/aleatoria', getRandomQuestionHandler);


export default router;
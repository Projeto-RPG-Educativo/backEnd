import { Router } from 'express';
import { getCharacterHandler, saveProgressHandler } from '../controllers/characterController';

const router = Router();

router.get('/:id', getCharacterHandler);
router.post('/save-progress', saveProgressHandler);

export default router;
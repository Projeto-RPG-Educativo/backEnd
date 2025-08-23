import { Router } from 'express';
import { registerUserHandler, loginUserHandler } from '../controllers/userController';

const router = Router();

router.post('/registrar', registerUserHandler);
router.post('/login', loginUserHandler);

export default router;
import { Router } from 'express';
import { registerUserHandler } from '../controllers/userController';

const router = Router();

// Quando uma requisição POST chegar em /registrar, chame a função registerUserHandler
router.post('/registrar', registerUserHandler);

// No futuro, você pode adicionar outras rotas aqui:
// router.post('/login', loginUserHandler);

export default router;
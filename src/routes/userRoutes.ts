import { Router } from 'express';
import { registerUserHandler, loginUserHandler } from '../controllers/userController';
import { validate } from '../middleware/validate';
import { registerUserSchema, loginUserSchema } from '../schemas/userSchemas';

const router = Router();

router.post('/registrar', validate(registerUserSchema), registerUserHandler);
router.post('/login', validate(loginUserSchema), loginUserHandler);

export default router;
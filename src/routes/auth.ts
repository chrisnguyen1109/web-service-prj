import { getMe, login, logout, register, updateMe } from '@/controllers';
import { checkAuth } from '@/middlewares';
import { Router } from 'express';

export const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);

authRouter.use(checkAuth);

authRouter.get('/me', getMe);
authRouter.patch('/me', updateMe);
authRouter.post('/logout', logout);

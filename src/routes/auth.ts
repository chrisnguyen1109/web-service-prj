import { getMe, login, logout, register, updateMe } from '@/controllers';
import { checkAuth } from '@/middlewares';
import {
    schemaAuthAuthorization,
    schemaAuthLogin,
    schemaAuthRegister,
    schemaAuthUpdate,
} from '@/validators';
import { celebrate, Segments } from 'celebrate';
import { Router } from 'express';

export const authRouter = Router();

authRouter.post(
    '/register',
    celebrate({
        [Segments.BODY]: schemaAuthRegister,
    }),
    register
);

authRouter.post(
    '/login',
    celebrate({
        [Segments.BODY]: schemaAuthLogin,
    }),
    login
);

authRouter.use(
    celebrate({
        [Segments.HEADERS]: schemaAuthAuthorization,
    }),
    checkAuth
);

authRouter.get('/me', getMe);

authRouter.patch(
    '/me',
    celebrate({
        [Segments.BODY]: schemaAuthUpdate,
    }),
    updateMe
);

authRouter.post('/logout', logout);

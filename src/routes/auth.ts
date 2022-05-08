import {
    getMe,
    login,
    logout,
    refreshToken,
    register,
    updateMe,
} from '@/controllers';
import { checkAuth } from '@/middlewares';
import {
    schemaAuthAuthorization,
    schemaAuthLogin,
    schemaAuthRefreshToken,
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

authRouter.post(
    '/refresh-token',
    celebrate({
        [Segments.BODY]: schemaAuthRefreshToken,
    }),
    refreshToken
);

authRouter.use(
    celebrate({
        [Segments.HEADERS]: schemaAuthAuthorization,
    }),
    checkAuth
);

authRouter
    .route('/me')
    .get(getMe)
    .patch(
        celebrate({
            [Segments.BODY]: schemaAuthUpdate,
        }),
        updateMe
    );

authRouter.post('/logout', logout);

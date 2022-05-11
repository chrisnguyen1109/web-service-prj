import {
    forgotPassword,
    getMe,
    getMyAssignments,
    login,
    logout,
    refreshToken,
    register,
    resetPassword,
    updateMe,
} from '@/controllers';
import { checkAuth } from '@/middlewares';
import {
    schemaAuthAuthorization,
    schemaAuthForgotPassword,
    schemaAuthLogin,
    schemaAuthRefreshToken,
    schemaAuthRegister,
    schemaAuthResetPassword,
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

authRouter.post(
    '/forgot-password',
    celebrate({
        [Segments.BODY]: schemaAuthForgotPassword,
    }),
    forgotPassword
);

authRouter.post(
    '/reset-password',
    celebrate({
        [Segments.BODY]: schemaAuthResetPassword,
    }),
    resetPassword
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

authRouter.get('/me/assignments', getMyAssignments);

authRouter.post('/logout', logout);

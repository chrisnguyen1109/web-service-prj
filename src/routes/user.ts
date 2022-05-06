import {
    createUser,
    deleteUser,
    getUser,
    getUsers,
    updateUser,
} from '@/controllers';
import { checkAuth, checkRole } from '@/middlewares';
import { UserRole } from '@/types';
import {
    schemaAuthAuthorization,
    schemaGetUsers,
    schemaRecordQuery,
    schemaUserCreate,
    schemaUserUpdate,
} from '@/validators';
import { celebrate, Segments } from 'celebrate';
import { Router } from 'express';

export const userRouter = Router();

userRouter
    .route('/')
    .get(
        celebrate({
            [Segments.QUERY]: schemaGetUsers,
        }),
        getUsers
    )
    .post(
        celebrate({
            [Segments.HEADERS]: schemaAuthAuthorization,
        }),
        checkAuth,
        checkRole([UserRole.ADMIN]),
        celebrate({
            [Segments.BODY]: schemaUserCreate,
        }),
        createUser
    );

userRouter
    .route('/:id')
    .get(
        celebrate({
            [Segments.QUERY]: schemaRecordQuery,
        }),
        getUser
    )
    .patch(
        celebrate({
            [Segments.HEADERS]: schemaAuthAuthorization,
        }),
        checkAuth,
        checkRole([UserRole.ADMIN, UserRole.DOCTOR]),
        celebrate({
            [Segments.BODY]: schemaUserUpdate,
        }),
        updateUser
    )
    .delete(
        celebrate({
            [Segments.HEADERS]: schemaAuthAuthorization,
        }),
        checkAuth,
        checkRole([UserRole.ADMIN]),
        deleteUser
    );

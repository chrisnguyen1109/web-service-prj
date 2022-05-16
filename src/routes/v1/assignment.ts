import { celebrate, Segments } from 'celebrate';
import { Router } from 'express';

import {
    createAssignment,
    deleteAssignment,
    getAssignment,
    getAssignments,
    updateAssignment,
} from '@/controllers';
import { checkAuth, checkRole } from '@/middlewares';
import { UserRole } from '@/types';
import {
    schemaAssignmentCreate,
    schemaAssignmentUpdate,
    schemaAuthAuthorization,
    schemaGetAssignments,
    schemaMongoIdParam,
    schemaRecordQuery,
} from '@/validators';

export const assignmentRouter = Router();

assignmentRouter
    .route('/')
    .get(
        celebrate({
            [Segments.QUERY]: schemaGetAssignments,
        }),
        getAssignments
    )
    .post(
        celebrate({
            [Segments.HEADERS]: schemaAuthAuthorization,
        }),
        checkAuth,
        celebrate({
            [Segments.BODY]: schemaAssignmentCreate,
        }),
        createAssignment
    );

assignmentRouter
    .route('/:id')
    .get(
        celebrate({
            [Segments.PARAMS]: schemaMongoIdParam,
            [Segments.QUERY]: schemaRecordQuery,
        }),
        getAssignment
    )
    .patch(
        celebrate({
            [Segments.PARAMS]: schemaMongoIdParam,
            [Segments.HEADERS]: schemaAuthAuthorization,
        }),
        checkAuth,
        checkRole([UserRole.ADMIN, UserRole.DOCTOR]),
        celebrate({
            [Segments.BODY]: schemaAssignmentUpdate,
        }),
        updateAssignment
    )
    .delete(
        celebrate({
            [Segments.PARAMS]: schemaMongoIdParam,
            [Segments.HEADERS]: schemaAuthAuthorization,
        }),
        checkAuth,
        deleteAssignment
    );

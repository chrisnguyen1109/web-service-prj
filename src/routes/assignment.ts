import {
    createAssignment,
    deleteAssignment,
    getAssignments,
    getAssignment,
    updateAssignment,
} from '@/controllers';
import { checkAuth, checkRole } from '@/middlewares';
import { UserRole } from '@/types';
import {
    schemaAssignmentCreate,
    schemaAssignmentUpdate,
    schemaAuthAuthorization,
    schemaGetFacilities,
    schemaRecordQuery,
} from '@/validators';
import { celebrate, Segments } from 'celebrate';
import { Router } from 'express';

export const assignmentRouter = Router();

assignmentRouter
    .route('/')
    .get(
        celebrate({
            [Segments.QUERY]: schemaGetFacilities,
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
            [Segments.QUERY]: schemaRecordQuery,
        }),
        getAssignment
    )
    .patch(
        celebrate({
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
            [Segments.HEADERS]: schemaAuthAuthorization,
        }),
        checkAuth,
        deleteAssignment
    );

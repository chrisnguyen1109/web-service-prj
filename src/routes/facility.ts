import {
    createFacility,
    deleteFacility,
    getFacilities,
    getFacility,
    updateFacility,
} from '@/controllers';
import { checkAuth, checkRole } from '@/middlewares';
import { UserRole } from '@/types';
import { schemaAuthAuthorization, schemaRecordQuery } from '@/validators';
import {
    schemaFacilityCreate,
    schemaFacilityUpdate,
    schemaGetFacilities,
} from '@/validators';
import { celebrate, Segments } from 'celebrate';
import { Router } from 'express';

export const facilityRouter = Router();

facilityRouter
    .route('/')
    .get(
        celebrate({
            [Segments.QUERY]: schemaGetFacilities,
        }),
        getFacilities
    )
    .post(
        celebrate({
            [Segments.HEADERS]: schemaAuthAuthorization,
        }),
        checkAuth,
        checkRole([UserRole.ADMIN]),
        celebrate({
            [Segments.BODY]: schemaFacilityCreate,
        }),
        createFacility
    );

facilityRouter
    .route('/:id')
    .get(
        celebrate({
            [Segments.QUERY]: schemaRecordQuery,
        }),
        getFacility
    )
    .patch(
        celebrate({
            [Segments.HEADERS]: schemaAuthAuthorization,
        }),
        checkAuth,
        checkRole([UserRole.ADMIN]),
        celebrate({
            [Segments.BODY]: schemaFacilityUpdate,
        }),
        updateFacility
    )
    .delete(
        celebrate({
            [Segments.HEADERS]: schemaAuthAuthorization,
        }),
        checkAuth,
        checkRole([UserRole.ADMIN]),
        deleteFacility
    );

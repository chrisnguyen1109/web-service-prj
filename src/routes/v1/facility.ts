import { celebrate, Segments } from 'celebrate';
import { Router } from 'express';

import {
    createFacility,
    deleteFacility,
    getFacilities,
    getFacilitiesWithin,
    getFacility,
    updateFacility,
} from '@/controllers';
import { checkAuth, checkRole } from '@/middlewares';
import { UserRole } from '@/types';
import {
    schemaAuthAuthorization,
    schemaFacilityCreate,
    schemaFacilityUpdate,
    schemaGetFacilities,
    schemaGetFacilitiesWithinParams,
    schemaMongoIdParam,
    schemaRecordQuery,
} from '@/validators';

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
    .route('/facilities-within/:distance/center/lat/:lat/lng/:lng')
    .get(
        celebrate({
            [Segments.PARAMS]: schemaGetFacilitiesWithinParams,
        }),
        getFacilitiesWithin
    );

facilityRouter
    .route('/:id')
    .get(
        celebrate({
            [Segments.PARAMS]: schemaMongoIdParam,
            [Segments.QUERY]: schemaRecordQuery,
        }),
        getFacility
    )
    .patch(
        celebrate({
            [Segments.PARAMS]: schemaMongoIdParam,
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
            [Segments.PARAMS]: schemaMongoIdParam,
            [Segments.HEADERS]: schemaAuthAuthorization,
        }),
        checkAuth,
        checkRole([UserRole.ADMIN]),
        deleteFacility
    );

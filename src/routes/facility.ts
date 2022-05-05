import {
    createFacility,
    deleteFacility,
    getFacilities,
    getFacility,
    updateFacility,
} from '@/controllers';
import { Router } from 'express';

export const facilityRouter = Router();

facilityRouter.route('/').get(getFacilities).post(createFacility);

facilityRouter
    .route('/:id')
    .get(getFacility)
    .patch(updateFacility)
    .delete(deleteFacility);

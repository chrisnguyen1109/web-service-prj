import { RESPONSE_MESSAGE } from '@/config';
import { FacilityDocument } from '@/models';
import {
    findAndUpdateFacility,
    getFacilityById,
    getFilterFacility,
    newFacility,
    softDeleteFacility,
} from '@/services';
import { catchAsync, catchListAsync, catchRecordAsync } from '@/utils';

export const getFacilities = catchListAsync<FacilityDocument>(
    async (req, res) => {
        const data = await getFilterFacility(req.query as Record<string, any>);

        res.status(200).json({
            message: RESPONSE_MESSAGE,
            data,
        });
    }
);

export const getFacility = catchRecordAsync<FacilityDocument>(
    async (req, res) => {
        const id = req.params.id;

        const data = await getFacilityById(
            id,
            req.query as Record<string, any>
        );

        res.status(200).json({
            message: RESPONSE_MESSAGE,
            data,
        });
    }
);

export const createFacility = catchRecordAsync<FacilityDocument>(
    async (req, res) => {
        const facility = await newFacility(req.body);

        res.status(201).json({
            message: RESPONSE_MESSAGE,
            data: {
                record: facility,
            },
        });
    }
);

export const updateFacility = catchRecordAsync<FacilityDocument>(
    async (req, res) => {
        const id = req.params.id;

        const facility = await findAndUpdateFacility({ id, body: req.body });

        res.status(200).json({
            message: RESPONSE_MESSAGE,
            data: {
                record: facility,
            },
        });
    }
);

export const deleteFacility = catchAsync(async (req, res) => {
    const id = req.params.id;

    await softDeleteFacility(id);

    res.status(204).json({
        message: RESPONSE_MESSAGE,
    });
});

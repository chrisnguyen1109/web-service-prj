import { FacilityDocument } from '@/models';
import {
    findAndUpdateFacility,
    getFacilityById,
    getFilterFacility,
    newFacility,
    softDeleteFacility,
} from '@/services';
import { ApiResponse } from '@/types';
import { catchAsync } from '@/utils';
import { Response } from 'express';

export const getFacilities = catchAsync(
    async (req, res: Response<ApiResponse<FacilityDocument[]>>) => {
        const data = await getFilterFacility(
            req.query as Record<string, string>
        );

        res.status(200).json({
            message: 'Success',
            data,
        });
    }
);

export const getFacility = catchAsync(
    async (req, res: Response<ApiResponse<FacilityDocument>>) => {
        const id = req.params.id;

        const facility = await getFacilityById(id);

        res.status(201).json({
            message: 'Success',
            data: {
                record: facility,
            },
        });
    }
);

export const createFacility = catchAsync(
    async (req, res: Response<ApiResponse<FacilityDocument>>) => {
        const facility = await newFacility(req.body);

        res.status(201).json({
            message: 'Success',
            data: {
                record: facility,
            },
        });
    }
);

export const updateFacility = catchAsync(
    async (req, res: Response<ApiResponse<FacilityDocument>>) => {
        const id = req.params.id;

        const facility = await findAndUpdateFacility({ id, body: req.body });

        res.status(200).json({
            message: 'Success',
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
        message: 'Success',
    });
});

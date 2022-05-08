import { RESPONSE_MESSAGE } from '@/config';
import { FacilityDocument } from '@/models';
import {
    findAndUpdateFacility,
    getFacilitiesWithinDistance,
    getFacilityById,
    getFilterFacility,
    newFacility,
    softDeleteFacility,
} from '@/services';
import { catchAsync } from '@/utils';

export const getFacilities = catchAsync<FacilityDocument[]>(
    async (req, res) => {
        const data = await getFilterFacility(req.query as Record<string, any>);

        res.status(200).json({
            message: RESPONSE_MESSAGE,
            data,
        });
    }
);

export const getFacility = catchAsync<FacilityDocument>(async (req, res) => {
    const id = req.params.id;

    const data = await getFacilityById(id, req.query as Record<string, any>);

    res.status(200).json({
        message: RESPONSE_MESSAGE,
        data,
    });
});

export const createFacility = catchAsync<FacilityDocument>(async (req, res) => {
    const facility = await newFacility(req.body);

    res.status(201).json({
        message: RESPONSE_MESSAGE,
        data: {
            record: facility,
        },
    });
});

export const updateFacility = catchAsync<FacilityDocument>(async (req, res) => {
    const id = req.params.id;

    const facility = await findAndUpdateFacility({ id, body: req.body });

    res.status(200).json({
        message: RESPONSE_MESSAGE,
        data: {
            record: facility,
        },
    });
});

export const deleteFacility = catchAsync(async (req, res) => {
    const id = req.params.id;

    await softDeleteFacility(id);

    res.status(204).json({
        message: RESPONSE_MESSAGE,
    });
});

export const getFacilitiesWithin = catchAsync(async (req, res) => {
    const { distance, lat, lng } = req.params;

    const facilities = await getFacilitiesWithinDistance({
        distance: +distance,
        lat: +lat,
        lng: +lng,
    });

    res.status(200).json({
        message: RESPONSE_MESSAGE,
        data: {
            records: facilities,
        },
    });
});

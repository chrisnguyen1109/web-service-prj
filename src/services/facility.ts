import createHttpError from 'http-errors';
import { NOT_FOUND } from 'http-status';

import { Facility, FacilityDocument } from '@/models';
import { IFacility, OmitIsDelete } from '@/types';
import { getFilterData, getRecordData } from '@/utils';

export const getFilterFacility = (query: Record<string, any>) =>
    getFilterData<FacilityDocument>(Facility, query, ['name', 'address']);

export const getFacilityById = async (
    id: string,
    query: Record<string, any>
) => {
    const facility = await getRecordData<FacilityDocument>(Facility, id, query);

    if (!facility) {
        throw createHttpError(NOT_FOUND, `No facility with this id: ${id}`);
    }

    return facility;
};

export const newFacility = (facility: OmitIsDelete<IFacility>) =>
    Facility.create({ ...facility });

interface FindAndUpdateFacilityProps {
    id: string;
    body: OmitIsDelete<IFacility>;
}

export const findAndUpdateFacility = async ({
    id,
    body,
}: FindAndUpdateFacilityProps) => {
    const updateFacility = await Facility.findByIdAndUpdate(
        id,
        {
            ...body,
        },
        { new: true }
    );

    if (!updateFacility) {
        throw createHttpError(NOT_FOUND, `No facility with this id: ${id}`);
    }

    return updateFacility;
};

export const softDeleteFacility = async (id: string) => {
    const deletedFacility = await Facility.findByIdAndUpdate(id, {
        isDelete: true,
    });

    if (!deletedFacility) {
        throw createHttpError(NOT_FOUND, `No facility with this id: ${id}`);
    }

    return deletedFacility;
};

interface GetFacilitiesWithinProps {
    distance: number;
    lat: number;
    lng: number;
}

export const getFacilitiesWithinDistance = ({
    distance,
    lat,
    lng,
}: GetFacilitiesWithinProps) => {
    const radius = distance / 6378.1;

    return Facility.find({
        startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
    });
};

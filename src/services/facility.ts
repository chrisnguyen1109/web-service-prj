import { Facility, FacilityDocument } from '@/models';
import { IFacility, OmitIsDelete } from '@/types';
import { getFilterData, getRecordData } from '@/utils';
import createHttpError from 'http-errors';

export const getFilterFacility = (query: Record<string, any>) => {
    return getFilterData<FacilityDocument>(Facility, query, [
        'name',
        'address',
    ]);
};

export const getFacilityById = async (
    id: string,
    query: Record<string, any>
) => {
    const facility = await getRecordData<FacilityDocument>(Facility, id, query);

    if (!facility) {
        throw createHttpError(404, `No facility with this id: ${id}`);
    }

    return facility;
};

export const newFacility = (facility: OmitIsDelete<IFacility>) => {
    return Facility.create({ ...facility });
};

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
        throw createHttpError(404, `No facility with this id: ${id}`);
    }

    return updateFacility;
};

export const softDeleteFacility = async (id: string) => {
    const deletedFacility = await Facility.findByIdAndUpdate(id, {
        isDelete: true,
    });

    if (!deletedFacility) {
        throw createHttpError(404, `No facility with this id: ${id}`);
    }

    return deletedFacility;
};

import { Document, Model } from 'mongoose';

import { FieldOfModel, ServerResponse } from '@/types';

import { FeatureApi } from './featureApi';
import { FeatureRecordApi } from './featureRecordApi';
import { getPagination } from './getPagination';

export const getFilterData = async <T extends Document>(
    model: Model<T>,
    queryObject: Record<string, any> = {},
    searchFields: FieldOfModel<T>[] = [],
    populateFields: Record<string, string[]> = {}
): Promise<ServerResponse<T[]>['data']> => {
    const featureApi = new FeatureApi<T>(model, queryObject);

    const query = featureApi.search([...searchFields]);

    const [data, totalData] = await Promise.all([
        query.projecting().sort().paginate().populate(populateFields).execute(),
        query.count(),
    ]);

    return {
        records: data,
        pagination: getPagination(queryObject, data, totalData),
    };
};

export const getRecordData = async <T extends Document>(
    model: Model<T>,
    id: string,
    queryObject: Record<string, any> = {},
    populateFields: Record<string, string[]> = {}
): Promise<ServerResponse<T>['data']> => {
    const featureApi = new FeatureRecordApi<T>(model, id, queryObject);

    const data = await featureApi
        .projecting()
        .populate(populateFields)
        .execute();

    return {
        record: data,
    };
};

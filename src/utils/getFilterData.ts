import { FieldOfModel, PopulateFields, ServerResponse } from '@/types';
import { Model, Document } from 'mongoose';
import { FeatureApi } from './featureApi';
import { getPagination } from './getPagination';

export const getFilterData = async <T extends Document>(
    model: Model<T>,
    queryObject: Record<string, any> = {},
    searchFields: FieldOfModel<T>[] = [],
    { embedFields, expandFields }: PopulateFields = {}
): Promise<ServerResponse<T[]>['data']> => {
    const featureApi = new FeatureApi<T>(model, queryObject);

    const query = featureApi.search([...searchFields]);

    const [data, totalData] = await Promise.all([
        query
            .projecting()
            .sort()
            .paginate()
            .populate({ embedFields, expandFields })
            .execute(),
        query.count(),
    ]);

    return {
        records: data,
        pagination: getPagination(queryObject, data, totalData),
    };
};

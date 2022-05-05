import { DEFAULT_LIMIT, DEFAULT_PAGE } from '@/config';
import { Pagination } from '@/types';
import { Document } from 'mongoose';

export const getPagination = (
    queryObject: Record<string, any>,
    document: Document[],
    total_records: number
): Pagination => {
    const page = +queryObject._page || DEFAULT_PAGE;
    const limit = +queryObject._limit || DEFAULT_LIMIT;
    const total_page = Math.ceil(total_records / limit);

    return {
        page,
        limit,
        records: document.length,
        total_records,
        total_page,
    };
};

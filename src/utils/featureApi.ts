import { DEFAULT_LIMIT, DEFAULT_PAGE, DEFAULT_START_PAGE } from '@/config';
import { FieldOfModel, PopulateFields } from '@/types';
import { Model, Document, Query, FilterQuery } from 'mongoose';
import { omitValueObj } from './omitValueObj';

export class FeatureApi<T extends Document> {
    private query: Query<T[], T>;
    private queryCount: Query<number, any>;

    constructor(
        private model: Model<T>,
        private queryString: Record<string, any>
    ) {
        const queryObject = this.filterQuery();

        this.query = this.model.find(queryObject);
        this.queryCount = this.model.countDocuments(queryObject);
    }

    private filterQuery(): FilterQuery<T> {
        const excludeFields = [
            '_page',
            '_sort',
            '_limit',
            '_fields',
            '_q',
            '_start',
            '_end',
            '_embed',
            '_expand',
        ];

        const queryObject = omitValueObj(
            this.queryString,
            excludeFields
        ) as FilterQuery<T>;

        for (const key in queryObject) {
            const matchFilter = key.match(/^[a-zA-Z]+_(gte|gt|lte|lt|ne)+$/);

            if (matchFilter) {
                const filterType = `$${matchFilter[1]}`;
                const filterField = key.split('_')[0] as keyof T;

                queryObject[filterField] = {
                    ...queryObject[filterField],
                    [filterType]: queryObject[key],
                };
            }
        }

        return queryObject;
    }

    search(fileds: FieldOfModel<T>[]): FeatureApi<T> {
        if (this.queryString._q && fileds.length > 0) {
            const searchField = fileds.map(field => ({
                [field]: new RegExp(`${this.queryString._q.trim()}`, 'i'),
            })) as FilterQuery<T>[];

            this.query.or(searchField);
            this.queryCount.or(searchField);
        }

        return this;
    }

    sort(): FeatureApi<T> {
        if (this.queryString._sort) {
            const sortFields = this.queryString._sort.split(',').join(' ');
            this.query.sort(sortFields);
        } else {
            this.query.sort('-createdAt');
        }

        return this;
    }

    projecting(): FeatureApi<T> {
        if (this.queryString._fields) {
            const selectFields = this.queryString._fields.split(',').join(' ');
            this.query.select(selectFields);
        }

        return this;
    }

    paginate(): FeatureApi<T> {
        const start = +this.queryString._start || DEFAULT_START_PAGE;
        const page = +this.queryString._page || DEFAULT_PAGE;
        const limit = +this.queryString._limit || DEFAULT_LIMIT;
        const end = +this.queryString._end;
        const skip = start - 1 + (page - 1) * limit;

        this.query.skip(skip).limit(end || limit);

        return this;
    }

    populate({
        embedFields,
        expandFields,
    }: PopulateFields = {}): FeatureApi<T> {
        if (this.queryString._embed) {
            this.query.populate({
                path: this.queryString._embed,
                select: embedFields?.join(' '),
            });
        }

        if (this.queryString._expand) {
            this.query.populate({
                path: this.queryString._expand,
                select: expandFields?.join(' '),
            });
        }

        return this;
    }

    count() {
        return this.queryCount;
    }

    execute() {
        return this.query;
    }
}

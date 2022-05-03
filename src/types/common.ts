import { Document } from 'mongoose';

export type ReplaceReturnType<T extends (...a: any) => any, TNewReturn> = (
    ...a: Parameters<T>
) => TNewReturn;

export interface Pagination {
    records: number;
    total_records: number;
    limit: number;
    page: number;
    total_page: number;
}

export type ServerResponse<T> = T extends Document[]
    ? { data: { records: T; pagination: Pagination } }
    : T extends Document
    ? { data: { record: T } }
    : { data?: Record<string, any> };

export type ApiResponse<T = any> = ServerResponse<T> & { message: string };

import { Document } from 'mongoose';
import { IUser } from './user';

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
    ? { data: { record: T | null } }
    : { data?: Record<string, any> };

export type ApiResponse<T = any> = ServerResponse<T> & { message: string };

export type FieldOfModel<T extends Document> = keyof Omit<T, keyof Document>;

export interface IsDelete {
    isDelete: boolean;
}

export type OmitIsDelete<T extends IsDelete> = Omit<T, 'isDelete'>;

export type FieldUserUpdate = Omit<
    OmitIsDelete<IUser>,
    'email' | 'password' | 'passwordModified' | 'role'
>;

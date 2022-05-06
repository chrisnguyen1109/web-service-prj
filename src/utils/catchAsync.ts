import { NextFunction, Request, RequestHandler, Response } from 'express';
import { ApiResponse, ReplaceReturnType, ServerResponse } from '@/types';
import { ParamsDictionary } from 'express-serve-static-core';
import { Document } from 'mongoose';

export const catchAsync = (
    fn: ReplaceReturnType<
        RequestHandler<ParamsDictionary, ApiResponse>,
        Promise<void>
    >
) => {
    return (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
        fn(req, res, next).catch(next);
    };
};

export const catchListAsync = <T extends Document>(
    fn: ReplaceReturnType<
        RequestHandler<ParamsDictionary, ApiResponse<T[]>>,
        Promise<void>
    >
) => {
    return (
        req: Request,
        res: Response<ApiResponse<T[]>>,
        next: NextFunction
    ) => {
        fn(req, res, next).catch(next);
    };
};

export const catchRecordAsync = <T extends Document>(
    fn: ReplaceReturnType<
        RequestHandler<ParamsDictionary, ApiResponse<T>>,
        Promise<void>
    >
) => {
    return (
        req: Request,
        res: Response<ApiResponse<T>>,
        next: NextFunction
    ) => {
        fn(req, res, next).catch(next);
    };
};

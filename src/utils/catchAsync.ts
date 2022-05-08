import { ApiResponse, ReplaceReturnType } from '@/types';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { Document } from 'mongoose';

export const catchAsync = <T extends Document | Document[] = any>(
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

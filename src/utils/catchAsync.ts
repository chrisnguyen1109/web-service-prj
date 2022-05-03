import { NextFunction, Request, RequestHandler, Response } from 'express';
import { ApiResponse, ReplaceReturnType } from '@/types';
import { ParamsDictionary } from 'express-serve-static-core';

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

import createHttpError from 'http-errors';
import { FORBIDDEN } from 'http-status';

import { UserRole } from '@/types';
import { catchAsync } from '@/utils';

export const checkRole = (roles: UserRole[]) =>
    catchAsync(async (req, _res, next) => {
        if (!roles.includes(req.user!.role)) {
            throw createHttpError(
                FORBIDDEN,
                'You do not have permission to perform this action!'
            );
        }

        next();
    });

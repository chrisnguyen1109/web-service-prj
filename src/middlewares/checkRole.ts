import { UserRole } from '@/types';
import { catchAsync } from '@/utils';
import createHttpError from 'http-errors';

export const checkRole = (roles: UserRole[]) => {
    return catchAsync(async (req, _res, next) => {
        if (!roles.includes(req.user!.role)) {
            throw createHttpError(
                403,
                'You do not have permission to perform this action!'
            );
        }

        next();
    });
};

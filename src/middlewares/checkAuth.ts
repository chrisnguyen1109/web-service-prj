import { catchAsync } from '@/utils';
import createHttpError from 'http-errors';
import { decodeToken } from '@/services';

export const checkAuth = catchAsync(async (req, _res, next) => {
    const header = req.headers;

    if (!header.authorization || !header.authorization.startsWith('Bearer')) {
        throw createHttpError(401, 'Auth required!');
    }

    const accessToken = header.authorization.split(' ')[1];

    const user = await decodeToken(accessToken);
    req.user = user;

    next();
});

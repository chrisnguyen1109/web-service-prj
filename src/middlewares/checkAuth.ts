import { decodeToken } from '@/services';
import { catchAsync } from '@/utils';

export const checkAuth = catchAsync(async (req, _res, next) => {
    const header = req.headers;

    const accessToken = header.authorization!.split(' ')[1];

    const user = await decodeToken(accessToken);
    req.user = user;

    next();
});

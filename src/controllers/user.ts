import { CREATED, NO_CONTENT, OK } from 'http-status';

import { RESPONSE_MESSAGE } from '@/config';
import { UserDocument } from '@/models';
import {
    findAndUpdateUser,
    getFilterUser,
    getUserById,
    newUser,
    softDeleteUser,
    updatePassword,
} from '@/services';
import { catchAsync } from '@/utils';

export const getUsers = catchAsync<UserDocument[]>(async (req, res) => {
    const data = await getFilterUser(req.query as Record<string, any>);

    res.status(OK).json({
        message: RESPONSE_MESSAGE,
        data,
    });
});

export const getUser = catchAsync<UserDocument>(async (req, res) => {
    const { id } = req.params;

    const data = await getUserById(id, req.query as Record<string, any>);

    res.status(OK).json({
        message: RESPONSE_MESSAGE,
        data,
    });
});

export const createUser = catchAsync<UserDocument>(async (req, res) => {
    const user = await newUser(req.body);

    res.status(CREATED).json({
        message: RESPONSE_MESSAGE,
        data: {
            record: user,
        },
    });
});

export const updateUser = catchAsync<UserDocument>(async (req, res) => {
    const { id } = req.params;
    const { password, newPassword, ...rest } = req.body;

    const user = await findAndUpdateUser({
        id,
        body: rest,
        currentRole: req.user!.role,
    });

    if (newPassword && password) {
        await updatePassword({ user, password, newPassword });
    }

    res.status(OK).json({
        message: RESPONSE_MESSAGE,
        data: {
            record: user,
        },
    });
});

export const deleteUser = catchAsync(async (req, res) => {
    const { id } = req.params;

    await softDeleteUser(id);

    res.status(NO_CONTENT).json({
        message: RESPONSE_MESSAGE,
    });
});

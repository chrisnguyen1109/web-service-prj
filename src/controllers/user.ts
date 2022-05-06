import { UserDocument } from '@/models';
import {
    findAndUpdateUser,
    getFilterUser,
    getUserById,
    newUser,
    softDeleteUser,
    updatePassword,
} from '@/services';
import { catchAsync, catchListAsync, catchRecordAsync } from '@/utils';

export const getUsers = catchListAsync<UserDocument>(async (req, res) => {
    const data = await getFilterUser(req.query as Record<string, any>);

    res.status(200).json({
        message: 'Success',
        data,
    });
});

export const getUser = catchRecordAsync<UserDocument>(async (req, res) => {
    const id = req.params.id;

    const data = await getUserById(id, req.query as Record<string, any>);

    res.status(200).json({
        message: 'Success',
        data,
    });
});

export const createUser = catchRecordAsync<UserDocument>(async (req, res) => {
    const user = await newUser(req.body);

    res.status(201).json({
        message: 'Success',
        data: {
            record: user as any,
        },
    });
});

export const updateUser = catchRecordAsync<UserDocument>(async (req, res) => {
    const id = req.params.id;
    const { password, newPassword, ...rest } = req.body;

    const user = await findAndUpdateUser({
        id,
        body: rest,
        currentRole: req.user!.role,
    });

    if (newPassword && password) {
        await updatePassword({ user, password, newPassword });
    }

    res.status(200).json({
        message: 'Success',
        data: {
            record: user,
        },
    });
});

export const deleteUser = catchAsync(async (req, res) => {
    const id = req.params.id;

    await softDeleteUser(id);

    res.status(204).json({
        message: 'Success',
    });
});

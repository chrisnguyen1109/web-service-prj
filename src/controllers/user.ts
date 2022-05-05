import { UserDocument } from '@/models';
import {
    findAndUpdateUser,
    getUserById,
    getFilterUser,
    newUser,
    softDeleteUser,
    updatePassword,
} from '@/services';
import { ApiResponse } from '@/types';
import { catchAsync } from '@/utils';
import { Response } from 'express';

export const getUsers = catchAsync(
    async (req, res: Response<ApiResponse<UserDocument[]>>) => {
        const data = await getFilterUser(req.query as Record<string, string>);

        res.status(200).json({
            message: 'Success',
            data,
        });
    }
);

export const getUser = catchAsync(
    async (req, res: Response<ApiResponse<UserDocument>>) => {
        const id = req.params.id;

        const user = await getUserById(id);

        res.status(201).json({
            message: 'Success',
            data: {
                record: user,
            },
        });
    }
);

export const createUser = catchAsync(
    async (req, res: Response<ApiResponse<UserDocument>>) => {
        const user = await newUser(req.body);

        res.status(201).json({
            message: 'Success',
            data: {
                record: user as any,
            },
        });
    }
);

export const updateUser = catchAsync(
    async (req, res: Response<ApiResponse<UserDocument>>) => {
        const id = req.params.id;
        const { password, newPassword, ...rest } = req.body;

        const user = await findAndUpdateUser({ id, body: rest });

        if (newPassword && password) {
            await updatePassword({ user, password, newPassword });
        }

        res.status(200).json({
            message: 'Success',
            data: {
                record: user,
            },
        });
    }
);

export const deleteUser = catchAsync(async (req, res) => {
    const id = req.params.id;

    await softDeleteUser(id);

    res.status(204).json({
        message: 'Success',
    });
});

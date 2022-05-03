import {
    checkLogin,
    createPatient,
    generateToken,
    updatePassword,
    updateProfile,
} from '@/services';
import { IPatient, User } from '@/types';
import { catchAsync, omitValueObj } from '@/utils';

export const register = catchAsync(async (req, res) => {
    const newUser = await createPatient(req.body as IPatient);

    const accessToken = await generateToken({ id: newUser._id });

    res.status(201).json({
        message: 'Success',
        data: {
            user: newUser,
            accessToken,
        },
    });
});

export const login = catchAsync(async (req, res) => {
    const { email, password } = req.body;

    const user = await checkLogin({ email, password });

    const accessToken = await generateToken({ id: user._id });

    res.status(200).json({
        message: 'Success',
        data: {
            user,
            accessToken,
        },
    });
});

export const getMe = catchAsync(async (req, res) => {
    res.status(200).json({
        message: 'Success',
        data: {
            user: req.user,
        },
    });
});

export const updateMe = catchAsync(async (req, res) => {
    const { password, newPassword, ...rest } = req.body;
    const validBody = omitValueObj(rest, [
        'health_infor',
        'email',
        'passwordModified',
    ]) as User;

    const updateUser = await updateProfile({
        id: req.user!._id,
        body: validBody,
    });

    if (newPassword && password) {
        await updatePassword({ patient: req.user!, password, newPassword });

        const accessToken = await generateToken({ id: req.user!._id });

        res.status(200).json({
            message: 'Success',
            data: {
                user: updateUser,
                accessToken,
            },
        });
    }

    res.status(200).json({
        message: 'Success',
        data: {
            user: updateUser,
        },
    });
});

export const logout = catchAsync(async (_req, res) => {
    res.status(200).json({
        message: 'Success',
    });
});

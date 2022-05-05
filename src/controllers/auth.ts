import {
    checkLogin,
    generateToken,
    updatePassword,
    findAndUpdateUser,
    newUser,
} from '@/services';
import { catchAsync } from '@/utils';

export const register = catchAsync(async (req, res) => {
    const patient = await newUser(req.body);

    const accessToken = await generateToken({ id: patient.user._id });

    res.status(201).json({
        message: 'Success',
        data: {
            user: patient.user,
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

    const updateUser = await findAndUpdateUser({
        id: req.user!._id,
        body: rest,
    });

    let accessToken: string | undefined = undefined;

    if (newPassword && password) {
        await updatePassword({ user: req.user!, password, newPassword });

        accessToken = await generateToken({ id: req.user!._id });
    }

    res.status(200).json({
        message: 'Success',
        data: {
            user: updateUser,
            accessToken,
        },
    });
});

export const logout = catchAsync(async (_req, res) => {
    res.status(200).json({
        message: 'Success',
    });
});

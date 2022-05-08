import { RESPONSE_MESSAGE } from '@/config';
import redisClient from '@/loaders/redisDatabase';
import {
    checkLogin,
    generateAccessToken,
    updatePassword,
    findAndUpdateUser,
    newUser,
    generateRefreshToken,
    verifyRefreshToken,
} from '@/services';
import { catchAsync } from '@/utils';

export const register = catchAsync(async (req, res) => {
    const user = await newUser(req.body);

    const accessToken = await generateAccessToken({ id: user._id });
    const refreshToken = await generateRefreshToken({ id: user._id });

    res.status(201).json({
        message: RESPONSE_MESSAGE,
        data: {
            user,
            accessToken,
            refreshToken,
        },
    });
});

export const login = catchAsync(async (req, res) => {
    const { email, password } = req.body;

    const user = await checkLogin({ email, password });

    const accessToken = await generateAccessToken({ id: user._id });
    const refreshToken = await generateRefreshToken({ id: user._id });

    res.status(200).json({
        message: RESPONSE_MESSAGE,
        data: {
            user,
            accessToken,
            refreshToken,
        },
    });
});

export const getMe = catchAsync(async (req, res) => {
    res.status(200).json({
        message: RESPONSE_MESSAGE,
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
        currentRole: req.user!.role,
    });

    let accessToken: string | undefined = undefined;

    if (newPassword && password) {
        await updatePassword({ user: req.user!, password, newPassword });

        accessToken = await generateAccessToken({ id: req.user!._id });
    }

    res.status(200).json({
        message: RESPONSE_MESSAGE,
        data: {
            user: updateUser,
            accessToken,
        },
    });
});

export const logout = catchAsync(async (req, res) => {
    redisClient.del(req.user!._id.toString());

    res.status(200).json({
        message: RESPONSE_MESSAGE,
    });
});

export const refreshToken = catchAsync(async (req, res) => {
    const id = await verifyRefreshToken(req.body.refreshToken);

    const accessToken = await generateAccessToken({ id });
    const refreshToken = await generateRefreshToken({ id });

    res.status(201).json({
        message: RESPONSE_MESSAGE,
        data: {
            accessToken,
            refreshToken,
        },
    });
});

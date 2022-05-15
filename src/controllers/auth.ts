import { RESPONSE_MESSAGE } from '@/config';
import {
    checkLogin,
    findAndCreateOauthUser,
    findAndUpdateUser,
    generateAccessToken,
    generateRefreshToken,
    getUserAssignments,
    logoutMe,
    newUser,
    resetPasswordWithToken,
    sendResetPasswordMail,
    updatePassword,
    verifyRefreshToken,
} from '@/services';
import { AuthType } from '@/types';
import { catchAsync } from '@/utils';
import { CREATED, OK } from 'http-status';
import passport from 'passport';

export const register = catchAsync(async (req, res) => {
    const user = await newUser(req.body);

    const accessToken = await generateAccessToken({ id: user._id });
    const refreshToken = await generateRefreshToken({ id: user._id });

    res.status(CREATED).json({
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

    res.status(OK).json({
        message: RESPONSE_MESSAGE,
        data: {
            user,
            accessToken,
            refreshToken,
        },
    });
});

export const loginOAuth = (authType: Exclude<AuthType, AuthType.LOCAL>) =>
    catchAsync(async (req, res, next) => {
        passport.authenticate(authType, async (_error, passportUser) => {
            const user = await findAndCreateOauthUser(passportUser);

            const accessToken = await generateAccessToken({ id: user?._id });
            const refreshToken = await generateRefreshToken({ id: user?._id });

            res.status(OK).json({
                message: RESPONSE_MESSAGE,
                data: {
                    user,
                    accessToken,
                    refreshToken,
                },
            });
        })(req, res, next);
    });

export const getMe = catchAsync(async (req, res) => {
    res.status(OK).json({
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
    let refreshToken: string | undefined = undefined;

    if (newPassword && password) {
        await updatePassword({ user: req.user!, password, newPassword });

        accessToken = await generateAccessToken({ id: req.user!._id });
        refreshToken = await generateRefreshToken({ id: req.user!._id });
    }

    res.status(OK).json({
        message: RESPONSE_MESSAGE,
        data: {
            user: updateUser,
            accessToken,
            refreshToken,
        },
    });
});

export const logout = catchAsync(async (req, res) => {
    await logoutMe(req.user!._id);

    res.status(OK).json({
        message: RESPONSE_MESSAGE,
    });
});

export const refreshToken = catchAsync(async (req, res) => {
    const id = await verifyRefreshToken(req.body.refreshToken);

    const accessToken = await generateAccessToken({ id });
    const refreshToken = await generateRefreshToken({ id });

    res.status(OK).json({
        message: RESPONSE_MESSAGE,
        data: {
            accessToken,
            refreshToken,
        },
    });
});

export const getMyAssignments = catchAsync(async (req, res) => {
    const user = await getUserAssignments(req.user!);

    res.status(OK).json({
        message: RESPONSE_MESSAGE,
        data: {
            user,
        },
    });
});

export const forgotPassword = catchAsync(async (req, res) => {
    const host = `${req.protocol}://${req.get('host')}/reset-password`;
    const { email } = req.body;

    await sendResetPasswordMail(email, host);

    res.status(OK).json({
        message: 'Token sent to your email!',
    });
});

export const resetPassword = catchAsync(async (req, res) => {
    const user = await resetPasswordWithToken(req.body);

    res.status(OK).json({
        message: RESPONSE_MESSAGE,
        data: {
            user,
        },
    });
});

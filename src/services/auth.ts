import {
    ACCESS_TOKEN_EXPIRE,
    REFRESH_TOKEN_EXPIRE,
    REFRESH_TOKEN_REDIS_EXPIRE,
    RESET_PASSWORD_TOKEN_EXPIRE,
} from '@/config';
import { redisClient } from '@/loaders';
import { User, UserDocument } from '@/models';
import { TokenType, UserRole } from '@/types';
import {
    compareBcrypt,
    generateRandomToken,
    MailService,
    redisRefreshTokenKey,
    redisResetPasswordKey,
} from '@/utils';
import fs from 'fs';
import createHttpError from 'http-errors';
import { BAD_REQUEST, NOT_FOUND, UNAUTHORIZED } from 'http-status';
import jwt from 'jsonwebtoken';
import path from 'path';
import { promisify } from 'util';

interface CheckLoginProps {
    email: string;
    password: string;
}

export const checkLogin = async ({ email, password }: CheckLoginProps) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw createHttpError(
            NOT_FOUND,
            'This email seems to no longer exist!'
        );
    }

    const passwordMatching = await compareBcrypt(password, user.password);
    if (!passwordMatching) {
        throw createHttpError(BAD_REQUEST, 'Wrong password!');
    }

    return user;
};

interface UpdatePasswordProps {
    user: UserDocument;
    password: string;
    newPassword: string;
}

export const updatePassword = async ({
    user,
    password,
    newPassword,
}: UpdatePasswordProps) => {
    const passwordMatching = await compareBcrypt(password, user.password);
    if (!passwordMatching) {
        throw createHttpError(BAD_REQUEST, 'Wrong password!');
    }

    user.password = newPassword;

    await user.save();
};

export const getUserAssignments = (user: UserDocument) => {
    return user.role === UserRole.DOCTOR
        ? user.populate('doctorAssignments')
        : user.role === UserRole.PATIENT
        ? user.populate('patientAssignments')
        : user;
};

export const generateJWT = async (payload: any, type: TokenType) => {
    const genTokenAsync = promisify(jwt.sign) as any;
    const readFileAsync = promisify(fs.readFile);

    const privateKey = await readFileAsync(
        path.join(__dirname, `../config/keys/${type}/privateKey.pem`)
    );

    const expiresIn =
        type === TokenType.ACCESS_TOKEN
            ? ACCESS_TOKEN_EXPIRE
            : REFRESH_TOKEN_EXPIRE;

    return genTokenAsync(payload, privateKey, {
        algorithm: 'RS256',
        expiresIn,
    });
};

export const generateAccessToken = async (payload: any): Promise<string> => {
    return generateJWT(payload, TokenType.ACCESS_TOKEN);
};

export const generateRefreshToken = async (payload: any): Promise<string> => {
    const refreshToken = await generateJWT(payload, TokenType.REFRESH_TOKEN);

    await redisClient.setEx(
        redisRefreshTokenKey(payload.id),
        REFRESH_TOKEN_REDIS_EXPIRE,
        refreshToken
    );

    return refreshToken;
};

export const decodeJWT = async (token: string, type: TokenType) => {
    const readFileAsync = promisify(fs.readFile);
    const publicKey = await readFileAsync(
        path.join(__dirname, `../config/keys/${type}/publicKey.pem`)
    );

    const decodeAsync = promisify(jwt.verify) as any;

    return decodeAsync(token, publicKey);
};

export const decodeToken = async (token: string) => {
    const { id, iat } = await decodeJWT(token, TokenType.ACCESS_TOKEN);

    const user = await User.findById(id);
    if (!user) {
        throw createHttpError(
            NOT_FOUND,
            'This email seems to no longer exist!'
        );
    }

    if (user.checkPasswordModified(iat)) {
        throw createHttpError(
            UNAUTHORIZED,
            'User recently changed password! Please log in again'
        );
    }

    return user;
};

export const verifyRefreshToken = async (refreshToken: string) => {
    const { id } = await decodeJWT(refreshToken, TokenType.REFRESH_TOKEN);

    const token = await redisClient.get(redisRefreshTokenKey(id));

    if (!token || token !== refreshToken) {
        throw createHttpError(UNAUTHORIZED, 'Unauthorized!');
    }

    return id;
};

export const logoutMe = (userId: string) => {
    return redisClient.del(redisRefreshTokenKey(userId));
};

export const sendResetPasswordMail = async (email: string, host: string) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw createHttpError(
            NOT_FOUND,
            'This email seems to no longer exist!'
        );
    }

    const { token, hashToken } = await generateRandomToken();

    await redisClient.setEx(
        redisResetPasswordKey(user._id),
        RESET_PASSWORD_TOKEN_EXPIRE,
        hashToken
    );

    const url = `${host}?token=${token}&userId=${user._id}`;

    return new MailService(user.email, {
        subject: 'Your password reset token (valid for 5 minutes)',
        url,
        fullname: user.fullName,
    }).sendResetPassword();
};

interface ResetPasswordWithTokenProps {
    userId: string;
    token: string;
    password: string;
}

export const resetPasswordWithToken = async ({
    password,
    token,
    userId,
}: ResetPasswordWithTokenProps) => {
    const resetToken = await redisClient.get(redisResetPasswordKey(userId));
    if (!resetToken) {
        throw createHttpError(
            NOT_FOUND,
            'Invalid or expired password reset token'
        );
    }

    const tokenMatching = await compareBcrypt(token, resetToken);
    if (!tokenMatching) {
        throw createHttpError(BAD_REQUEST, 'Wrong reset password token!');
    }

    const user = await User.findById(userId);
    if (!user) {
        throw createHttpError(NOT_FOUND, 'This user seems to no longer exist!');
    }

    user.password = password;
    await user.save();

    await redisClient.del(redisResetPasswordKey(user._id));

    return user;
};

import {
    ACCESS_TOKEN_EXPIRE,
    REFRESH_TOKEN_EXPIRE,
    REFRESH_TOKEN_REDIS_EXPIRE,
} from '@/config';
import redisClient from '@/loaders/redisDatabase';
import { User, UserDocument } from '@/models';
import { TokenType } from '@/types';
import { comparePassword } from '@/utils';
import fs from 'fs';
import createHttpError from 'http-errors';
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
        throw createHttpError(404, 'This email seems to no longer exist!');
    }

    const passwordMatching = await comparePassword(password, user.password);
    if (!passwordMatching) {
        throw createHttpError(400, 'Wrong password!');
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
    const passwordMatching = await comparePassword(password, user.password);
    if (!passwordMatching) {
        throw createHttpError(400, 'Wrong password!');
    }

    user.password = newPassword;

    await user.save();
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
        payload.id.toString(),
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
        throw createHttpError(404, 'This email seems to no longer exist!');
    }

    if (user.checkPasswordModified(iat)) {
        throw createHttpError(
            401,
            'User recently changed password! Please log in again'
        );
    }

    return user;
};

export const verifyRefreshToken = async (refreshToken: string) => {
    const { id } = await decodeJWT(refreshToken, TokenType.REFRESH_TOKEN);

    const token = await redisClient.get(id);

    if (!token || token !== refreshToken) {
        throw createHttpError(401, 'Unauthorized!');
    }

    return id;
};

import { JWT_EXPIRE } from '@/config';
import { User, UserDocument } from '@/models';
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

export const generateToken = async (payload: any): Promise<string> => {
    const genTokenAsync = promisify(jwt.sign) as any;
    const readFileAsync = promisify(fs.readFile);

    const privateKey = await readFileAsync(
        path.join(__dirname, '../config/keys/privateKey.pem')
    );

    return genTokenAsync(payload, privateKey, {
        algorithm: 'RS256',
        expiresIn: JWT_EXPIRE,
    });
};

export const decodeToken = async (token: string) => {
    const readFileAsync = promisify(fs.readFile);
    const publicKey = await readFileAsync(
        path.join(__dirname, '../config/keys/publicKey.pem')
    );

    const decodeAsync = promisify(jwt.verify) as any;
    const { id, iat } = await decodeAsync(token, publicKey);

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

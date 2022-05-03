import { JWT_EXPIRE } from '@/config';
import { Patient, PatientDocument } from '@/models';
import { IPatient, User } from '@/types';
import { comparePassword } from '@/utils';
import fs from 'fs';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongoose';
import path from 'path';
import { promisify } from 'util';

export const createPatient = (patient: IPatient) => {
    return Patient.create({ ...patient });
};

export const checkLogin = async ({
    email,
    password,
}: {
    email: string;
    password: string;
}) => {
    const user = await Patient.findOne({ email });
    if (!user) {
        throw createHttpError(400, 'Invalid email!');
    }

    const passwordMatching = await comparePassword(password, user.password);
    if (!passwordMatching) {
        throw createHttpError(400, 'Wrong password!');
    }

    return user;
};

export const updatePassword = async ({
    patient,
    password,
    newPassword,
}: {
    patient: PatientDocument;
    password: string;
    newPassword: string;
}) => {
    const passwordMatching = await comparePassword(password, patient.password);
    if (!passwordMatching) {
        throw createHttpError(400, 'Wrong password!');
    }

    patient.password = newPassword;

    await patient.save();
};

export const updateProfile = async ({
    id,
    body,
}: {
    id: ObjectId;
    body: User;
}) => {
    const updatePatient = await Patient.findByIdAndUpdate(
        id,
        {
            ...body,
        },
        { new: true }
    );

    if (!updatePatient) {
        throw createHttpError(404, `No user with this id: ${id}`);
    }

    return updatePatient;
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

    const user = await Patient.findById(id);
    if (!user) throw createHttpError(401, 'This user seems to no longer exist');

    if (user.checkPasswordModified(iat)) {
        throw createHttpError(
            401,
            'User recently changed password! Please log in again'
        );
    }

    return user;
};

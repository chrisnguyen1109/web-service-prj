import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { BCRYPT_SALT } from '@/config';

export const generateRandomToken = async () => {
    const token = crypto.randomBytes(32).toString('hex');
    const salt = await bcrypt.genSalt(BCRYPT_SALT ? +BCRYPT_SALT : undefined);
    const hashToken = await bcrypt.hash(token, salt);

    return {
        token,
        hashToken,
    };
};

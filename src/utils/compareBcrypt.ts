import bcrypt from 'bcryptjs';

export const compareBcrypt = (token: string, hashToken: string) => {
    return bcrypt.compare(token, hashToken);
};

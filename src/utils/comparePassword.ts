import bcrypt from 'bcryptjs';

export const comparePassword = (password: string, userPassword: string) => {
    return bcrypt.compare(password, userPassword);
};

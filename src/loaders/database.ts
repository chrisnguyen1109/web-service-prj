import { DATABASE } from '@/config';
import createHttpError from 'http-errors';
import mongoose from 'mongoose';

export const connectDB = async () => {
    if (!DATABASE) {
        throw createHttpError(503, 'Connect database failed!');
    }

    await mongoose.connect(DATABASE);

    console.log('Connect database successfully!');
};

import { DATABASE } from '@/config';
import createHttpError from 'http-errors';
import { SERVICE_UNAVAILABLE } from 'http-status';
import mongoose from 'mongoose';

export const connectDB = async () => {
    if (!DATABASE) {
        throw createHttpError(SERVICE_UNAVAILABLE, 'Connect database failed!');
    }

    await mongoose.connect(DATABASE);

    console.log('Connect database successfully!');
};

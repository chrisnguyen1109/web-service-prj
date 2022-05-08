import { globalErrorHandler } from '@/controllers';
import { errors } from 'celebrate';
import compression from 'compression';
import cors from 'cors';
import express, { Express } from 'express';
import createHttpError from 'http-errors';
import connectDB from './database';
import { connectRedisDB } from './redisDatabase';
import routeLoader from './routes';

const appLoader = async (app: Express) => {
    await Promise.all([connectDB(), connectRedisDB()]);

    app.enable('trust proxy');

    app.use(cors());

    app.use(express.json());
    app.use(
        express.urlencoded({
            extended: true,
        })
    );

    app.use(
        compression({
            filter: () => true,
        })
    );

    app.use('/api/v1', routeLoader());

    app.all('*', (req, _res, next) => {
        next(
            createHttpError(404, `Can't find ${req.originalUrl} on this server`)
        );
    });

    app.use(globalErrorHandler);

    app.use(errors());
};

export default appLoader;

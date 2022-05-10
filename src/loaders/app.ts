import { globalErrorHandler } from '@/controllers';
import { errors } from 'celebrate';
import compression from 'compression';
import cors from 'cors';
import express, { Express } from 'express';
import createHttpError from 'http-errors';
import { connectDB } from './database';
import { loadJobs } from './jobs';
import { connectRedisDB } from './redisDatabase';
import { loadRoutes } from './routes';
import { loadSwaggerDocs } from './swagger';

export const loadApp = async (app: Express) => {
    const mongoDB = connectDB();
    const redisDB = connectRedisDB();

    await mongoDB;
    await redisDB;

    app.enable('trust proxy');

    app.use(cors());

    app.use(express.json());
    app.use(
        express.urlencoded({
            extended: true,
        })
    );

    app.use(compression());

    loadJobs();

    app.use('/api/v1', loadRoutes());

    loadSwaggerDocs(app);

    app.all('*', (req, _res, next) => {
        next(
            createHttpError(404, `Can't find ${req.originalUrl} on this server`)
        );
    });

    app.use(globalErrorHandler);

    app.use(errors());
};

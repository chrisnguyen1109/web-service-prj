import { globalErrorHandler } from '@/controllers';
import { errors } from 'celebrate';
import compression from 'compression';
import cors from 'cors';
import express, { Express } from 'express';
import createHttpError from 'http-errors';
import { NOT_FOUND } from 'http-status';
import { connectDB } from './database';
import { connectRedisDB } from './redisDatabase';

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

    require('./jobs').loadJobs();

    require('./passport').loadPassports();

    require('./routes').loadRoutes(app);

    require('./swagger').loadSwaggerDocs(app);

    app.all('*', (req, _res, next) => {
        next(
            createHttpError(
                NOT_FOUND,
                `Can't find ${req.originalUrl} on this server`
            )
        );
    });

    app.use(globalErrorHandler);

    app.use(errors());
};

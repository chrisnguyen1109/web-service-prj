import compression from 'compression';
import express, { Express, Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import connectDB from './database';
import routeLoader from './routes';
import cors from 'cors';

const appLoader = async (app: Express) => {
    await connectDB();

    app.enable('trust proxy');

    app.use(cors());

    app.use(express.json());
    app.use(
        express.urlencoded({
            extended: true,
        })
    );

    app.use(compression());

    app.use('/api/v1', routeLoader());

    app.all('*', (req, _res, next) => {
        next(
            createHttpError(404, `Can't find ${req.originalUrl} on this server`)
        );
    });

    app.use(
        (error: unknown, req: Request, res: Response, next: NextFunction) => {
            if (
                error instanceof Error ||
                error instanceof createHttpError.HttpError
            ) {
                console.log(error.name);
                console.log(error.message);
            }

            res.status(500).json({ message: 'Unknow error!' });
        }
    );
};

export default appLoader;

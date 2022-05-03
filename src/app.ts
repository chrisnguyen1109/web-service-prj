import 'dotenv/config';
import express from 'express';
import { PORT } from '@/config';
import { PatientDocument } from '@/models';

declare global {
    namespace Express {
        interface Request {
            user?: PatientDocument & {
                _id: any;
            };
        }
    }
}

const app = express();

require('@/loaders').default(app);

process.on('uncaughtException', error => {
    console.log(error.name);
    console.log(error.message);
    console.log('UNCAUGHT EXCEPTION!');
    process.exit(1);
});

const server = app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}!`);
});

process.on('unhandledRejection', error => {
    if (error instanceof Error) {
        console.log(error.name);
        console.log(error.message);
    }
    console.log('UNHANDLED REJECTION!');
    server.close(() => {
        process.exit(1);
    });
});

process.on('SIGTERM', () => {
    console.log('SIGTERM RECEIVED!');
    server.close(() => {
        console.log('Proccess terminated');
    });
});

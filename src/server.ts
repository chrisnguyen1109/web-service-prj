import 'dotenv/config';
import express from 'express';
import { PORT } from '@/config';
import { UserDocument } from '@/models';

declare global {
    namespace Express {
        interface Request {
            user?: UserDocument & {
                _id: any;
            };
        }
    }
}

const app = express();

require('@/loaders').loadApp(app);

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

// heroku restart every 24 hours in order to keep app in healthy state, heroky will send the flag SIGTERM so shutdown server to make sure every request in process not hanging out
process.on('SIGTERM', () => {
    console.log('SIGTERM RECEIVED!');
    server.close(() => {
        console.log('Proccess terminated');
    });
});

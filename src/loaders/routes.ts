import { loadRoutesV1 } from '@/routes';
import { Express } from 'express';

export const loadRoutes = (app: Express) => {
    app.use('/api/v1', loadRoutesV1());
};

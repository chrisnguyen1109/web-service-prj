import { Express, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';

import openapi from '@/docs/openapi.json';

export const loadSwaggerDocs = (app: Express) => {
    // Swagger page
    app.use('/docs', swaggerUi.serve);
    app.get('/docs', swaggerUi.setup(openapi));

    // Docs in JSON format
    app.get('/docs.json', (_req: Request, res: Response) => {
        res.status(200).json(openapi);
    });
};

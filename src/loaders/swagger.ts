import swaggerUi from 'swagger-ui-express';
import { Express, Request, Response } from 'express';
import openapi from '@/swagger/openapi-final.json';

export const loadSwaggerDocs = (app: Express) => {
    // Swagger page
    app.use('/docs', swaggerUi.serve);
    app.get('/docs', swaggerUi.setup(openapi));

    // Docs in JSON format
    app.get('/docs.json', (_req: Request, res: Response) => {
        res.status(200).json(openapi);
    });
};

import swaggerUi from 'swagger-ui-express';
import { Express, Request, Response } from 'express';
import openapi from '@/swaggers/openapi-final.json';

export const loadSwaggerDocs = (app: Express) => {
    // Swagger page
    app.use('/docs', swaggerUi.serve);
    app.get('/docs', swaggerUi.setup(openapi));

    // Docs in JSON format
    app.get('/docs.json', (_req: Request, res: Response) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(openapi);
    });
};

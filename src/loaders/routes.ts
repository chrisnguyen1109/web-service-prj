import { authRouter } from '@/routes';
import { Router } from 'express';

const routeLoader = () => {
    const router = Router();

    router.use('/auth', authRouter);

    return router;
};

export default routeLoader;

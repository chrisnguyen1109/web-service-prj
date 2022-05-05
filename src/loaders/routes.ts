import { authRouter, facilityRouter, userRouter } from '@/routes';
import { Router } from 'express';

const routeLoader = () => {
    const router = Router();

    router.use('/auth', authRouter);
    router.use('/user', userRouter);
    router.use('/facility', facilityRouter);

    return router;
};

export default routeLoader;

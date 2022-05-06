import {
    assignmentRouter,
    authRouter,
    facilityRouter,
    userRouter,
} from '@/routes';
import { Router } from 'express';

const routeLoader = () => {
    const router = Router();

    router.use('/auth', authRouter);
    router.use('/user', userRouter);
    router.use('/facility', facilityRouter);
    router.use('/assignment', assignmentRouter);

    return router;
};

export default routeLoader;

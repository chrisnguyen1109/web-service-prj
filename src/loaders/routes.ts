import {
    assignmentRouter,
    authRouter,
    facilityRouter,
    userRouter,
} from '@/routes';
import { Router } from 'express';

export const loadRoutes = () => {
    const router = Router();

    router.use('/auth', authRouter);
    router.use('/user', userRouter);
    router.use('/facility', facilityRouter);
    router.use('/assignment', assignmentRouter);

    return router;
};

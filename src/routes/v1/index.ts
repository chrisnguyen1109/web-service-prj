import { Router } from 'express';
import { assignmentRouter } from './assignment';
import { authRouter } from './auth';
import { facilityRouter } from './facility';
import { userRouter } from './user';

export const loadRoutesV1 = () => {
    const router = Router();

    router.use('/auth', authRouter);
    router.use('/user', userRouter);
    router.use('/facility', facilityRouter);
    router.use('/assignment', assignmentRouter);

    return router;
};

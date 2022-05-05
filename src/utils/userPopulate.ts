import { UserDocument } from '@/models';
import { UserRole } from '@/types';

export const userPopulate = (user: UserDocument & { _id: any }) => {
    if (user.role === UserRole.PATIENT) {
        return user.populate('patient');
    }

    if (user.role === UserRole.DOCTOR) {
        return user.populate('doctor');
    }

    return user;
};

import { IsDelete } from './common';
import { IUser } from './user';

export enum AssignmentStatus {
    PENDING = 'pending',
    CANCEL = 'cancel',
    COMPLETED = 'completed',
}

export interface IAssignment extends IsDelete {
    patient: IUser;
    doctor: IUser;
    notes?: string;
    status?: AssignmentStatus;
    assignmentTime: {
        date: string | Date;
        time: string;
    };
}

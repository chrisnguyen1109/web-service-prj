import { IsDelete, UnavailableTime } from './common';
import { IUser } from './user';

export enum AssignmentStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
}

export interface IAssignment extends IsDelete {
    patient: IUser | string;
    doctor: IUser | string;
    notes?: string;
    status?: AssignmentStatus;
    assignmentTime: UnavailableTime;
}

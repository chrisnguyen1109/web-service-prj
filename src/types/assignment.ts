import { IsDelete, UnavailableTime } from './common';

export enum AssignmentStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
}

export interface IAssignment extends IsDelete {
    patient: string;
    doctor: string;
    notes?: string;
    status?: AssignmentStatus;
    assignmentTime: UnavailableTime;
}

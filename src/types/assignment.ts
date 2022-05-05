import { IsDelete } from './common';
import { IDoctor } from './doctor';
import { IPatient } from './patient';

export enum AssignmentStatus {
    PENDING = 'pending',
    CANCEL = 'cancel',
    COMPLETED = 'completed',
}

export interface IAssignment extends IsDelete {
    patient: IPatient;
    doctor: IDoctor;
    notes?: string;
    status?: AssignmentStatus;
    assignmentTime: {
        date: string | Date;
        time: string;
    };
}

import { IDoctor } from './doctor';
import { IPatient } from './patient';

export enum AssignmentStatus {
    PENDING = 'pending',
    CANCEL = 'cancel',
    COMPLETED = 'completed',
}

export interface IAssignment {
    patient: IPatient;
    doctor: IDoctor;
    notes?: string;
    status?: AssignmentStatus;
    time: {
        date: string | Date;
        time: string;
    };
}

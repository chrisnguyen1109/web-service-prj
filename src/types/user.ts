import { IsDelete } from './common';
import { IDoctor } from './doctor';
import { IPatient } from './patient';

export enum UserRole {
    PATIENT = 'patient',
    DOCTOR = 'doctor',
    ADMIN = 'admin',
}

export interface IUser extends IsDelete {
    email: string;
    password: string;
    passwordModified?: Date;
    fullName: string;
    avatar: string;
    phoneNumber?: string;
    role: UserRole;
    patient?: IPatient;
    doctor?: IDoctor;
}

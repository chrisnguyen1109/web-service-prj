import { IsDelete, UnavailableTime } from './common';
import { IFacility } from './facility';

export enum UserRole {
    PATIENT = 'patient',
    DOCTOR = 'doctor',
    ADMIN = 'admin',
}

export interface HealthInfor {
    bmiAndBsa: string;
    bloodPressure: string;
    temprature: string;
}
export interface IUser extends IsDelete {
    email: string;
    password: string;
    passwordModified?: Date;
    fullName: string;
    avatar: string;
    phoneNumber?: string;
    role: UserRole;
    descriptions?: string;
    specialisation?: string;
    unavailableTime?: UnavailableTime[];
    facility?: IFacility | string;
    healthInfor?: HealthInfor;
}

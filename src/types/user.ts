import { IsDelete } from './common';
import { IFacility } from './facility';

export enum UserRole {
    PATIENT = 'patient',
    DOCTOR = 'doctor',
    ADMIN = 'admin',
}

export interface UnavailableTime {
    date: Date | string;
    times: string[];
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
    facility?: IFacility;
    healthInfor?: HealthInfor;
}

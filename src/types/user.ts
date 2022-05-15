import { IsDelete, UnavailableTime } from './common';

export enum UserRole {
    PATIENT = 'patient',
    DOCTOR = 'doctor',
    ADMIN = 'admin',
}

export enum AuthType {
    LOCAL = 'local',
    GOOGLE = 'google',
    FACEBOOK = 'facebook',
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
    facility?: string;
    healthInfor?: HealthInfor;
    authType: AuthType;
    googleId?: string;
    facebookId?: string;
}

import { IUser } from './user';

export interface HealthInfor {
    bmiAndBsa: string;
    bloodPressure: string;
    temprature: string;
}

export interface IPatient {
    healthInfor?: Partial<HealthInfor>;
    user: IUser;
}

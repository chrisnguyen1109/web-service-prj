import { Account, User } from './user';

export interface HealthInfor {
    bmiAndBsa: string;
    bloodPressure: string;
    temprature: string;
}

export interface IPatient extends User, Account {
    healthInfor?: Partial<HealthInfor>;
}

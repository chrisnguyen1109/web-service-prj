import { Account, User } from './user';

export interface HealthInfor {
    bmiAndBsa: string;
    blood_pressure: string;
    temprature: string;
}

export interface IPatient extends User, Account {
    health_infor?: Partial<HealthInfor>;
}

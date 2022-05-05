import { IFacility } from './facility';
import { IUser } from './user';

export interface UnavailableTime {
    date: Date | string;
    times: string[];
}

export interface IDoctor {
    descriptions?: string;
    specialisation: string;
    unavailableTime?: UnavailableTime[];
    facility: IFacility;
    user: IUser;
}

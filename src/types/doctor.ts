import { IFacility } from './facility';
import { User } from './user';

export interface UnavailableTime {
    date: Date | string;
    times: string[];
}

export interface IDoctor extends User {
    descriptions?: string;
    specialisation: string;
    unavailable_time?: UnavailableTime[];
    facility: IFacility;
}

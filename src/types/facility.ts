import { IsDelete } from './common';

export interface IFacility extends IsDelete {
    name: string;
    address: string;
    image?: string;
    location: {
        type: 'Point';
        coordinates: [number];
    };
}

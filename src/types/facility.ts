export interface IFacility {
    name: string;
    address: string;
    image?: string;
    location: {
        type: 'Point';
        coordinates: [Number];
    };
}

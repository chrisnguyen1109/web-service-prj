import { IFacility } from '@/types';
import { trimmedStringType } from '@/utils';
import mongoose, { Document, Model, Schema } from 'mongoose';

interface FacilityDocument extends IFacility, Document {}

interface FacilityModel extends Model<FacilityDocument> {}

const facilitySchema: Schema<FacilityDocument, FacilityModel> = new Schema(
    {
        name: {
            ...trimmedStringType,
            required: [true, 'Name field must be required!'],
        },
        address: {
            ...trimmedStringType,
            required: [true, 'Address field must be required!'],
        },
        image: {
            ...trimmedStringType,
            default: '',
        },
        location: {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point'],
            },
            coordinates: [Number],
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform(_doc, ret) {
                delete ret.__v;
                return ret;
            },
        },
        toObject: { virtuals: true },
        id: false,
    }
);

facilitySchema.virtual('doctors', {
    ref: 'Doctor',
    foreignField: 'facility',
    localField: '_id',
});

export const Facility = mongoose.model<FacilityDocument, FacilityModel>(
    'Facility',
    facilitySchema
);

import { DEFAULT_FACILITY_IMAGE } from '@/config';
import { IFacility } from '@/types';
import { trimmedStringType } from '@/utils';
import mongoose, { Document, Model, Query, Schema } from 'mongoose';
import validator from 'validator';

export interface FacilityDocument extends IFacility, Document {}

interface FacilityModel extends Model<FacilityDocument> {}

const facilitySchema: Schema<FacilityDocument, FacilityModel> = new Schema(
    {
        name: {
            ...trimmedStringType,
            required: [true, 'Name field must be required!'],
            unique: true,
        },
        address: {
            ...trimmedStringType,
            required: [true, 'Address field must be required!'],
        },
        image: {
            ...trimmedStringType,
            validate: [validator.isURL, 'Invalid url!'],
            default: DEFAULT_FACILITY_IMAGE,
        },
        location: {
            type: {
                type: String,
                enum: ['Point'],
                required: [true, 'Location field must be required!'],
            },
            coordinates: [Number],
        },
        isDelete: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform(_doc, ret) {
                delete ret.__v;
                delete ret.isDelete;
                return ret;
            },
        },
        toObject: { virtuals: true },
        id: false,
    }
);

facilitySchema.index({ location: '2dsphere' });

facilitySchema.virtual('users', {
    ref: 'User',
    foreignField: 'facility',
    localField: '_id',
});

facilitySchema.pre<
    Query<FacilityDocument | FacilityDocument[], FacilityDocument>
>(/^find/, async function (next) {
    this.find({ isDelete: { $ne: true } });

    next();
});

export const Facility = mongoose.model<FacilityDocument, FacilityModel>(
    'Facility',
    facilitySchema
);

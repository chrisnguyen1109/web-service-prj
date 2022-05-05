import { IDoctor } from '@/types';
import { trimmedStringType } from '@/utils';
import mongoose, { Document, Model, Schema } from 'mongoose';

export interface DoctorDocument extends IDoctor, Document {}

interface DoctorModel extends Model<DoctorDocument> {}

const doctorSchema: Schema<DoctorDocument, DoctorModel> = new Schema(
    {
        descriptions: {
            ...trimmedStringType,
        },
        specialisation: {
            ...trimmedStringType,
            required: [true, 'Specialisation field must be required!'],
        },
        unavailableTime: [
            {
                date: Date,
                times: [{ ...trimmedStringType }],
            },
        ],
        facility: {
            type: Schema.Types.ObjectId,
            ref: 'Facility',
            require: [true, 'Doctor must belong to a facility!'],
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            require: [true, 'Doctor must be an user!'],
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform(_doc, ret) {
                delete ret.__v;
                return ret;
            },
        },
        toObject: { virtuals: true },
        id: false,
    }
);

doctorSchema.virtual('assignments', {
    ref: 'Assignment',
    foreignField: 'doctor',
    localField: '_id',
});

export const Doctor = mongoose.model<DoctorDocument, DoctorModel>(
    'Doctor',
    doctorSchema
);

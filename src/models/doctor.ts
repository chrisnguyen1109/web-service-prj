import { IDoctor } from '@/types';
import { trimmedStringType } from '@/utils';
import mongoose, { Document, Model, Schema } from 'mongoose';
import validator from 'validator';

interface DoctorDocument extends IDoctor, Document {}

interface DoctorModel extends Model<DoctorDocument> {}

const doctorSchema: Schema<DoctorDocument, DoctorModel> = new Schema(
    {
        full_name: {
            ...trimmedStringType,
            required: [true, 'Full name field must be required!'],
            validate: {
                validator: (val: string) => {
                    return val.split(' ').length > 1;
                },
                message: 'Full name contains at least 2 words',
            },
        },
        phone_number: {
            ...trimmedStringType,
            validate: [validator.isMobilePhone, 'Invalid phone number format!'],
        },
        avatar: {
            ...trimmedStringType,
            default: '',
        },
        descriptions: {
            ...trimmedStringType,
        },
        specialisation: {
            ...trimmedStringType,
            required: [true, 'Specialisation field must be required!'],
        },
        unavailable_time: [
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

doctorSchema.virtual('assignments', {
    ref: 'Assignment',
    foreignField: 'doctor',
    localField: '_id',
});

export const Doctor = mongoose.model<DoctorDocument, DoctorModel>(
    'Doctor',
    doctorSchema
);

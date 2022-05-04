import { IDoctor } from '@/types';
import { trimmedStringType } from '@/utils';
import mongoose, { Document, Model, Schema } from 'mongoose';
import validator from 'validator';

interface DoctorDocument extends IDoctor, Document {}

interface DoctorModel extends Model<DoctorDocument> {}

const doctorSchema: Schema<DoctorDocument, DoctorModel> = new Schema(
    {
        fullName: {
            ...trimmedStringType,
            required: [true, 'Full name field must be required!'],
            validate: {
                validator: (val: string) => {
                    return val.split(' ').length > 1;
                },
                message: 'Full name contains at least 2 words',
            },
        },
        phoneNumber: {
            ...trimmedStringType,
            validate: [validator.isMobilePhone, 'Invalid phone number format!'],
        },
        avatar: {
            ...trimmedStringType,
            validate: [validator.isURL, 'Invalid url!'],
            default:
                'https://res.cloudinary.com/chriscloud1109/image/upload/v1651629584/media/default_gr1p4q.jpg',
        },
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

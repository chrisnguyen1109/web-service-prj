import { IPatient } from '@/types';
import { checkMultipleWords, trimmedStringType } from '@/utils';
import mongoose, { Document, Model, Schema } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

export interface PatientDocument extends IPatient, Document {
    checkPasswordModified: (jwtIat: number) => boolean;
}

interface PatientModel extends Model<PatientDocument> {}

const patientSchema: Schema<PatientDocument, PatientModel> = new Schema(
    {
        fullName: {
            ...trimmedStringType,
            required: [true, 'Full name field must be required!'],
            validate: {
                validator: (val: string) => checkMultipleWords(val, 2),
                message: 'Full name contains at least 2 words',
            },
        },
        email: {
            ...trimmedStringType,
            required: [true, 'Email field must be required!'],
            unique: true,
            validate: [validator.isEmail, 'Invalid email format!'],
        },
        password: {
            ...trimmedStringType,
            required: [true, 'Password field must be required!'],
            minlength: [
                6,
                'Password must have more or equal than 6 characters!',
            ],
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
        healthInfor: {
            bmiAndBsa: {
                ...trimmedStringType,
            },
            bloodPressure: {
                ...trimmedStringType,
            },
            temprature: {
                ...trimmedStringType,
            },
        },
        passwordModified: {
            type: Date,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform(_doc, ret) {
                delete ret.__v;
                delete ret.password;
                delete ret.passwordModified;
                return ret;
            },
        },
        toObject: { virtuals: true },
        id: false,
    }
);

patientSchema.virtual('assignments', {
    ref: 'Assignment',
    foreignField: 'patient',
    localField: '_id',
});

patientSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    this.passwordModified = new Date();

    next();
});

patientSchema.methods.checkPasswordModified = function (jwtIat: number) {
    if (this.passwordModified) {
        return (
            parseInt((this.passwordModified.getTime() / 1000).toString()) >
            jwtIat
        );
    }

    return false;
};

export const Patient = mongoose.model<PatientDocument, PatientModel>(
    'Patient',
    patientSchema
);

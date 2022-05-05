import { IPatient } from '@/types';
import { trimmedStringType } from '@/utils';
import mongoose, { Document, Model, Schema } from 'mongoose';

export interface PatientDocument extends IPatient, Document {}

interface PatientModel extends Model<PatientDocument> {}

const patientSchema: Schema<PatientDocument, PatientModel> = new Schema(
    {
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
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            require: [true, 'Patient must be an user!'],
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

patientSchema.virtual('assignments', {
    ref: 'Assignment',
    foreignField: 'patient',
    localField: '_id',
});

export const Patient = mongoose.model<PatientDocument, PatientModel>(
    'Patient',
    patientSchema
);

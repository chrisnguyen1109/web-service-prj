import { endOfDay, startOfDay } from 'date-fns';
import createHttpError from 'http-errors';
import { BAD_REQUEST, NOT_FOUND } from 'http-status';
import mongoose, { Document, Model, Query, Schema } from 'mongoose';

import { AssignmentStatus, IAssignment, UserRole } from '@/types';
import { omitValueObj, trimmedStringType } from '@/utils';

import { User } from './user';

export interface AssignmentDocument extends IAssignment, Document {}

type AssignmentModel = Model<AssignmentDocument>;

const assignmentSchema: Schema<AssignmentDocument, AssignmentModel> =
    new Schema(
        {
            patient: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                require: [true, 'Assignment must belong to a patient!'],
            },
            doctor: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                require: [true, 'Assignment must belong to a doctor!'],
            },
            notes: {
                ...trimmedStringType,
            },
            status: {
                ...trimmedStringType,
                enum: {
                    values: Object.values(AssignmentStatus),
                    message: 'Status is either pending, cancel or completed!',
                },
                default: AssignmentStatus.PENDING,
            },
            assignmentTime: {
                date: {
                    type: Date,
                    required: [true, 'Date field must be required!'],
                },
                time: {
                    ...trimmedStringType,
                    required: [true, 'Time field must be required!'],
                },
            },
            isDelete: {
                type: Boolean,
                default: false,
            },
        },
        {
            timestamps: true,
            toJSON: {
                transform(_doc, ret) {
                    const response = omitValueObj(ret, ['__v', 'isDelete']);

                    return response;
                },
            },
        }
    );

assignmentSchema.pre<
    Query<AssignmentDocument | AssignmentDocument[], AssignmentDocument>
>(/^find/, async function (next) {
    this.find({ isDelete: { $ne: true } });

    next();
});

assignmentSchema.pre('save', async function (next) {
    if (!this.isNew) return next();

    const patientId = this.patient;
    const doctorId = this.doctor;
    const assignmentDate = this.assignmentTime.date;
    const assignmentTime = this.assignmentTime.time;

    const matchingPatient = await User.findOne({
        _id: patientId,
        role: UserRole.PATIENT,
    });
    if (!matchingPatient) {
        throw createHttpError(
            NOT_FOUND,
            `No patient with this id: ${patientId}`
        );
    }

    const matchingDoctor = await User.findOne({
        _id: doctorId,
        role: UserRole.DOCTOR,
    });
    if (!matchingDoctor) {
        throw createHttpError(NOT_FOUND, `No doctor with this id: ${doctorId}`);
    }

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const assignment = await Assignment.findOne({
        doctor: doctorId,
        'assignmentTime.date': {
            $gte: startOfDay(assignmentDate),
            $lt: endOfDay(assignmentDate),
        },
        'assignmentTime.time': assignmentTime,
    });
    if (assignment) {
        throw createHttpError(BAD_REQUEST, `This schedule has been existed!`);
    }

    await User.findOneAndUpdate(
        {
            _id: this.doctor,
            role: UserRole.DOCTOR,
        },
        {
            $push: {
                unavailableTime: {
                    date: assignmentDate,
                    time: assignmentTime,
                },
            },
        }
    );

    return next();
});

export const Assignment = mongoose.model<AssignmentDocument, AssignmentModel>(
    'Assignment',
    assignmentSchema
);

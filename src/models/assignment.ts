import { AssignmentStatus, IAssignment } from '@/types';
import { checkSimilarTime, trimmedStringType } from '@/utils';
import createHttpError from 'http-errors';
import mongoose, { Document, Model, Query, Schema } from 'mongoose';
import { User } from './user';

export interface AssignmentDocument extends IAssignment, Document {}

interface AssignmentModel extends Model<AssignmentDocument> {}

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
                    delete ret.__v;
                    delete ret.isDelete;
                    return ret;
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

    const doctor = await User.findById(this.doctor);

    if (!doctor) {
        throw createHttpError(404, `No doctor with this id: ${this.doctor}`);
    }

    for (const unavailableTime of doctor.unavailableTime || []) {
        if (checkSimilarTime(this.assignmentTime, unavailableTime)) {
            throw createHttpError(400, `This schedule has been existed!`);
        }
    }

    doctor.unavailableTime = (doctor.unavailableTime ?? []).concat(
        this.assignmentTime
    );

    await doctor.save();

    next();
});

export const Assignment = mongoose.model<AssignmentDocument, AssignmentModel>(
    'Assignment',
    assignmentSchema
);

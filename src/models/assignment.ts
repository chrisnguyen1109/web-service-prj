import { AssignmentStatus, IAssignment } from '@/types';
import { trimmedStringType } from '@/utils';
import mongoose, { Document, Model, Schema } from 'mongoose';

interface AssignmentDocument extends IAssignment, Document {}

interface AssignmentModel extends Model<AssignmentDocument> {}

const assignmentSchema: Schema<AssignmentDocument, AssignmentModel> =
    new Schema(
        {
            patient: {
                type: Schema.Types.ObjectId,
                ref: 'Patient',
                require: [true, 'Assignment must belong to a patient!'],
            },
            doctor: {
                type: Schema.Types.ObjectId,
                ref: 'Doctor',
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
            time: {
                date: {
                    type: Date,
                    required: [true, 'Date field must be required!'],
                },
                time: {
                    ...trimmedStringType,
                    required: [true, 'Time field must be required!'],
                },
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
        }
    );

export const Assignment = mongoose.model<AssignmentDocument, AssignmentModel>(
    'Assignment',
    assignmentSchema
);

import { endOfDay, startOfDay } from 'date-fns';
import createHttpError from 'http-errors';
import { NOT_FOUND } from 'http-status';

import { Assignment, AssignmentDocument, User } from '@/models';
import { IAssignment, OmitIsDelete, UserRole } from '@/types';
import { getFilterData, getRecordData } from '@/utils';

export const getFilterAssignment = (query: Record<string, any>) => {
    const queryObject = Object.keys(query).reduce((prev, key) => {
        if (/^(assignmentTime.date)+_(gte|gt|lte|lt|ne)+$/.test(key)) {
            return {
                ...prev,
                'assignmentTime.date': {
                    [`$${key.split('_')[1]}`]: new Date(query[key]),
                },
            };
        }

        if (key === 'assignmentTime.date') {
            return {
                ...prev,
                'assignmentTime.date': {
                    $gte: startOfDay(new Date(query[key])),
                    $lt: endOfDay(new Date(query[key])),
                },
            };
        }

        return { ...prev, [key]: query[key] };
    }, {});

    return getFilterData<AssignmentDocument>(Assignment, queryObject, [
        'status',
        'notes',
        'assignmentTime.time',
    ]);
};

export const getAssignmentById = async (
    id: string,
    query: Record<string, any>
) => {
    const assignment = await getRecordData<AssignmentDocument>(
        Assignment,
        id,
        query
    );

    if (!assignment) {
        throw createHttpError(NOT_FOUND, `No assignment with this id: ${id}`);
    }

    return assignment;
};

export const newAssignment = async (assignment: OmitIsDelete<IAssignment>) =>
    Assignment.create({ ...assignment });

interface FindAndUpdateAssignmentProps {
    id: string;
    body: Pick<IAssignment, 'status' | 'notes'>;
}

export const findAndUpdateAssignment = async ({
    id,
    body,
}: FindAndUpdateAssignmentProps) => {
    const updateAssignment = await Assignment.findByIdAndUpdate(
        id,
        {
            ...body,
        },
        { new: true }
    );

    if (!updateAssignment) {
        throw createHttpError(NOT_FOUND, `No assignment with this id: ${id}`);
    }

    return updateAssignment;
};

export const softDeleteAssignment = async (id: string) => {
    const deletedAssignment = await Assignment.findByIdAndUpdate(id, {
        isDelete: true,
    });

    if (!deletedAssignment) {
        throw createHttpError(NOT_FOUND, `No assignment with this id: ${id}`);
    }

    await User.findOneAndUpdate(
        {
            _id: deletedAssignment.doctor,
            role: UserRole.DOCTOR,
        },
        {
            $pull: {
                unavailableTime: {
                    date: {
                        $gte: startOfDay(deletedAssignment.assignmentTime.date),
                        $lt: endOfDay(deletedAssignment.assignmentTime.date),
                    },
                    time: deletedAssignment.assignmentTime.time,
                },
            },
        }
    );

    return deletedAssignment;
};

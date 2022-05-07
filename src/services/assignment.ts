import { Assignment, AssignmentDocument, User } from '@/models';
import { IAssignment, OmitIsDelete, UserRole } from '@/types';
import { getFilterData, getRecordData } from '@/utils';
import { endOfDay, startOfDay } from 'date-fns';
import createHttpError from 'http-errors';

export const getFilterAssignment = (query: Record<string, any>) => {
    let objectQuery = {};

    for (const key in query) {
        if (/^(assignmentTime.date)+_(gte|gt|lte|lt|ne)+$/.test(key)) {
            objectQuery = {
                ...objectQuery,
                'assignmentTime.date': {
                    [`$${key.split('_')[1]}`]: new Date(query[key]),
                },
            };
        } else if (key === 'assignmentTime.date') {
            objectQuery = {
                ...objectQuery,
                'assignmentTime.date': {
                    $gte: startOfDay(new Date(query[key])),
                    $lt: endOfDay(new Date(query[key])),
                },
            };
        } else {
            objectQuery = { ...objectQuery, [key]: query[key] };
        }
    }

    return getFilterData<AssignmentDocument>(Assignment, objectQuery, [
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
        throw createHttpError(404, `No assignment with this id: ${id}`);
    }

    return assignment;
};

export const newAssignment = async (assignment: OmitIsDelete<IAssignment>) => {
    return Assignment.create({ ...assignment });
};

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
        throw createHttpError(404, `No assignment with this id: ${id}`);
    }

    return updateAssignment;
};

export const softDeleteAssignment = async (id: string) => {
    const deletedAssignment = await Assignment.findByIdAndUpdate(id, {
        isDelete: true,
    });

    if (!deletedAssignment) {
        throw createHttpError(404, `No assignment with this id: ${id}`);
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

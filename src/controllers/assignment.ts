import { AssignmentDocument } from '@/models';
import {
    findAndUpdateAssignment,
    getAssignmentById,
    getFilterAssignment,
    newAssignment,
    softDeleteAssignment,
} from '@/services';
import { catchAsync, catchListAsync, catchRecordAsync } from '@/utils';

export const getAssignments = catchListAsync<AssignmentDocument>(
    async (req, res) => {
        const data = await getFilterAssignment(
            req.query as Record<string, any>
        );

        res.status(200).json({
            message: 'Success',
            data,
        });
    }
);

export const getAssignment = catchRecordAsync<AssignmentDocument>(
    async (req, res) => {
        const id = req.params.id;

        const data = await getAssignmentById(
            id,
            req.query as Record<string, any>
        );

        res.status(200).json({
            message: 'Success',
            data,
        });
    }
);

export const createAssignment = catchRecordAsync<AssignmentDocument>(
    async (req, res) => {
        const assignment = await newAssignment(req.body);

        res.status(201).json({
            message: 'Success',
            data: {
                record: assignment,
            },
        });
    }
);

export const updateAssignment = catchRecordAsync<AssignmentDocument>(
    async (req, res) => {
        const id = req.params.id;

        const assignment = await findAndUpdateAssignment({
            id,
            body: req.body,
        });

        res.status(200).json({
            message: 'Success',
            data: {
                record: assignment,
            },
        });
    }
);

export const deleteAssignment = catchAsync(async (req, res) => {
    const id = req.params.id;

    await softDeleteAssignment(id);

    res.status(204).json({
        message: 'Success',
    });
});

import { CREATED, NO_CONTENT, OK } from 'http-status';

import { RESPONSE_MESSAGE } from '@/config';
import { AssignmentDocument } from '@/models';
import {
    findAndUpdateAssignment,
    getAssignmentById,
    getFilterAssignment,
    newAssignment,
    softDeleteAssignment,
} from '@/services';
import { catchAsync } from '@/utils';

export const getAssignments = catchAsync<AssignmentDocument[]>(
    async (req, res) => {
        const data = await getFilterAssignment(
            req.query as Record<string, any>
        );

        res.status(OK).json({
            message: RESPONSE_MESSAGE,
            data,
        });
    }
);

export const getAssignment = catchAsync<AssignmentDocument>(
    async (req, res) => {
        const {id} = req.params;

        const data = await getAssignmentById(
            id,
            req.query as Record<string, any>
        );

        res.status(OK).json({
            message: RESPONSE_MESSAGE,
            data,
        });
    }
);

export const createAssignment = catchAsync<AssignmentDocument>(
    async (req, res) => {
        const assignment = await newAssignment(req.body);

        res.status(CREATED).json({
            message: RESPONSE_MESSAGE,
            data: {
                record: assignment,
            },
        });
    }
);

export const updateAssignment = catchAsync<AssignmentDocument>(
    async (req, res) => {
        const {id} = req.params;

        const assignment = await findAndUpdateAssignment({
            id,
            body: req.body,
        });

        res.status(OK).json({
            message: RESPONSE_MESSAGE,
            data: {
                record: assignment,
            },
        });
    }
);

export const deleteAssignment = catchAsync(async (req, res) => {
    const {id} = req.params;

    await softDeleteAssignment(id);

    res.status(NO_CONTENT).json({
        message: RESPONSE_MESSAGE,
    });
});

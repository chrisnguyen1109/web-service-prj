import { Joi } from 'celebrate';

import { AssignmentStatus, IAssignment, Leaves } from '@/types';

import {
    objectSchemaQuery,
    schemaFutureDate,
    schemaValidDate,
    schemaValidMongoId,
} from './common';

const assignmentFields: Leaves<IAssignment>[] = ['status'];

export const schemaGetAssignments = objectSchemaQuery(assignmentFields).keys({
    'assignmentTime.time': Joi.string().pattern(
        /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/
    ),
    'assignmentTime.date': schemaValidDate,
    ...['gte', 'gt', 'lte', 'lt', 'ne'].reduce(
        (acc, cur) => ({
            ...acc,
            [`assignmentTime.date_${cur}`]: schemaValidDate,
        }),
        {}
    ),
});

export const schemaAssignmentCreate = Joi.object({
    patient: schemaValidMongoId('Patient id must be valid Mongo Id'),
    doctor: schemaValidMongoId('Doctor id must be valid Mongo Id'),
    notes: Joi.string(),
    assignmentTime: Joi.object({
        date: schemaFutureDate.required(),
        time: Joi.string()
            .pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)
            .required(),
    }).required(),
}).required();

export const schemaAssignmentUpdate = Joi.object({
    notes: Joi.string(),
    status: [
        Joi.string().valid(AssignmentStatus.PENDING),
        Joi.string().valid(AssignmentStatus.COMPLETED),
    ],
});

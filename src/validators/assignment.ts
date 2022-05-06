import { Joi } from 'celebrate';
import { objectSchemaQuery, schemaValidMongoId } from './common';
import validator from 'validator';
import { AssignmentStatus, IAssignment } from '@/types';

const assignmentFields: (keyof IAssignment)[] = ['status'];

export const schemaGetAssignments = objectSchemaQuery(assignmentFields);

export const schemaAssignmentCreate = Joi.object({
    patient: schemaValidMongoId('Patient id must be valid Mongo Id'),
    doctor: schemaValidMongoId('Doctor id must be valid Mongo Id'),
    notes: Joi.string(),
    assignmentTime: Joi.object({
        date: Joi.string()
            .custom((val, helpers) =>
                validator.isDate(val, { format: 'dd/MM/yyyy' })
                    ? val
                    : helpers.message({
                          custom: 'Invalid date format',
                      })
            )
            .required(),
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

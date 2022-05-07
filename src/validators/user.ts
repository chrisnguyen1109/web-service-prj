import { IUser, UserRole } from '@/types';
import { Joi } from 'celebrate';
import {
    objectSchemaQuery,
    objectSchemaUserCreate,
    objectSchemaUserUpdate,
    schemaRoleCondition,
    schemaUserRole,
    schemaValidMongoId,
} from './common';

const userFields: (keyof IUser)[] = [
    'email',
    'fullName',
    'phoneNumber',
    'specialisation',
    'descriptions',
];

export const schemaGetUsers = objectSchemaQuery(userFields).keys({
    role: schemaUserRole,
});

export const schemaUserCreate = Joi.object({
    ...objectSchemaUserCreate,
    role: schemaUserRole,
    descriptions: schemaRoleCondition(UserRole.DOCTOR, Joi.string()),
    specialisation: schemaRoleCondition(
        UserRole.DOCTOR,
        Joi.string().required()
    ),
    facility: schemaRoleCondition(
        UserRole.DOCTOR,
        schemaValidMongoId('Facility id must be valid Mongo Id')
    ),
    healthInfor: schemaRoleCondition(
        UserRole.PATIENT,
        Joi.object({
            bmiAndBsa: Joi.string(),
            bloodPressure: Joi.string(),
            temprature: Joi.string(),
        })
    ),
}).required();

export const schemaUserUpdate = Joi.object({
    ...objectSchemaUserUpdate,
    descriptions: Joi.string(),
    specialisation: Joi.string(),
    facility: Joi.string(),
    healthInfor: Joi.object({
        bmiAndBsa: Joi.string(),
        bloodPressure: Joi.string(),
        temprature: Joi.string(),
    }),
}).with('password', 'newPassword');

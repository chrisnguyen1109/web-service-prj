import { IUser, UserRole } from '@/types';
import { Joi } from 'celebrate';
import {
    objectSchemaQuery,
    objectSchemaUserCreate,
    objectSchemaUserUpdate,
    schemaUserRole,
} from './common';

const userFields: (keyof IUser)[] = [
    'fullName',
    'email',
    'phoneNumber',
    'avatar',
    'role',
];

export const schemaGetUsers = objectSchemaQuery(userFields, {
    role: schemaUserRole,
});

export const schemaUserCreate = Joi.object({
    ...objectSchemaUserCreate,
    role: schemaUserRole,
    externals: Joi.when('role', [
        {
            is: UserRole.DOCTOR,
            then: Joi.object({
                descriptions: Joi.string(),
                specialisation: Joi.string().required(),
                facility: Joi.string().required(),
            }),
        },
        {
            is: UserRole.PATIENT,
            then: Joi.object({
                healthInfor: Joi.object({
                    bmiAndBsa: Joi.string(),
                    bloodPressure: Joi.string(),
                    temprature: Joi.string(),
                }),
            }),
            otherwise: Joi.forbidden(),
        },
    ]),
}).required();

export const schemaUserUpdate = Joi.object({
    ...objectSchemaUserUpdate,
}).with('password', 'newPassword');

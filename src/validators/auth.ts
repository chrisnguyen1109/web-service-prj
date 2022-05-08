import { Joi } from 'celebrate';
import { objectSchemaUserCreate, objectSchemaUserUpdate } from './common';

export const schemaAuthRegister = Joi.object({
    ...objectSchemaUserCreate,
}).required();

export const schemaAuthLogin = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
}).required();

export const schemaAuthAuthorization = Joi.object({
    authorization: Joi.string()
        .pattern(/^Bearer /)
        .required(),
}).unknown();

export const schemaAuthUpdate = Joi.object({
    ...objectSchemaUserUpdate,
}).with('password', 'newPassword');

export const schemaAuthRefreshToken = Joi.object({
    refreshToken: Joi.string().required(),
}).required();

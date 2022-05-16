import { Joi } from 'celebrate';

import {
    objectSchemaUserCreate,
    objectSchemaUserUpdate,
    schemaValidMongoId,
} from './common';

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

export const schemaAuthForgotPassword = Joi.object({
    email: Joi.string().email().required(),
}).required();

export const schemaAuthResetPassword = Joi.object({
    password: Joi.string().min(6).required(),
    userId: schemaValidMongoId('User id must be valid Mongo Id'),
    token: Joi.string().required(),
}).required();

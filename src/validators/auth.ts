import { Joi } from 'celebrate';
import validator from 'validator';

export const schemaAuthRegister = Joi.object({
    full_name: Joi.string()
        .custom(
            val => val.split(' ').length > 1,
            'Full name contains at least 2 words'
        )
        .required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone_number: Joi.string().custom(
        val => validator.isMobilePhone(val),
        'Invalid phone number format!'
    ),
    avatar: Joi.string(),
    health_infor: Joi.object({
        bmiAndBsa: Joi.string(),
        blood_pressure: Joi.string(),
        temprature: Joi.string(),
    }),
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
    full_name: Joi.string().custom(
        val => val.split(' ').length > 1,
        'Full name contains at least 2 words'
    ),
    avatar: Joi.string(),
    phone_number: Joi.string().custom(
        val => validator.isMobilePhone(val),
        'Invalid phone number format!'
    ),
    password: Joi.string().min(6),
    newPassword: Joi.ref('password'),
}).with('password', 'newPassword');

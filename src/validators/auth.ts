import { checkMultipleWords } from '@/utils';
import { Joi } from 'celebrate';
import validator from 'validator';

export const schemaAuthRegister = Joi.object({
    fullName: Joi.string()
        .custom((val, helpers) =>
            checkMultipleWords(val, 2)
                ? val
                : helpers.message({
                      custom: 'Full name contains at least 2 words',
                  })
        )
        .required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phoneNumber: Joi.string().custom((val, helpers) =>
        validator.isMobilePhone(val)
            ? val
            : helpers.message({ custom: 'Invalid phone number' })
    ),
    avatar: Joi.string().custom((val, helpers) =>
        validator.isURL(val) ? val : helpers.message({ custom: 'Invalid url' })
    ),
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
    fullName: Joi.string().custom((val, helpers) =>
        checkMultipleWords(val, 2)
            ? val
            : helpers.message({
                  custom: 'Full name contains at least 2 words',
              })
    ),
    avatar: Joi.string().custom((val, helpers) =>
        validator.isURL(val) ? val : helpers.message({ custom: 'Invalid url' })
    ),
    phoneNumber: Joi.string().custom((val, helpers) =>
        validator.isMobilePhone(val)
            ? val
            : helpers.message({ custom: 'Invalid phone number' })
    ),
    password: Joi.string().min(6),
    newPassword: Joi.string().min(6),
}).with('password', 'newPassword');

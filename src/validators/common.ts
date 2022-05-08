import { DATE_FORMAT } from '@/config';
import { UserRole } from '@/types';
import { checkMultipleWords } from '@/utils';
import { Joi } from 'celebrate';
import { isFuture } from 'date-fns';
import validator from 'validator';

export const objectSchemaUserCreate = {
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
};

export const objectSchemaUserUpdate = {
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
};

export const schemaUserRole = Joi.alternatives().try(
    Joi.string().valid(UserRole.ADMIN),
    Joi.string().valid(UserRole.PATIENT),
    Joi.string().valid(UserRole.DOCTOR)
);

export const objectSchemaQuery = (fileds: string[]) =>
    Joi.object({
        _page: Joi.number().integer().positive(),
        _limit: Joi.number().integer().positive(),
        _start: Joi.number().integer().positive(),
        _end: Joi.number().integer().positive().greater(Joi.ref('_start')),
        _expand: [Joi.array().items(Joi.string()), Joi.string()],
        _q: Joi.string(),
        _sort: [Joi.array().items(Joi.string()), Joi.string()],
        _fields: [Joi.array().items(Joi.string()), Joi.string()],
        ...fileds.reduce((acc, cur) => {
            return { ...acc, [cur]: Joi.string() };
        }, {}),
    }).pattern(new RegExp(`(${fileds.join('|')})+_(gte|gt|lte|lt|ne)+$`), [
        Joi.string(),
        Joi.number(),
    ]);

export const schemaRecordQuery = Joi.object({
    _expand: [Joi.array().items(Joi.string()), Joi.string()],
    _fields: [Joi.array().items(Joi.string()), Joi.string()],
});

export const schemaRoleCondition = (role: UserRole, schema: any) => {
    return Joi.when('role', {
        is: role,
        then: schema,
        otherwise: Joi.forbidden(),
    });
};

export const schemaValidMongoId = (msg: string) =>
    Joi.string()
        .custom((val, helpers) =>
            validator.isMongoId(val)
                ? val
                : helpers.message({
                      custom: msg,
                  })
        )
        .required();

export const schemaMongoIdParam = Joi.object({
    id: schemaValidMongoId('Param id must be valid Mongo Id'),
}).required();

export const schemaValidDate = Joi.string().custom((val, helpers) =>
    validator.isDate(val, { format: DATE_FORMAT })
        ? val
        : helpers.message({
              custom: 'Invalid date format',
          })
);

export const schemaFutureDate = Joi.string().custom((val, helpers) =>
    !validator.isDate(val, { format: DATE_FORMAT })
        ? helpers.message({
              custom: 'Invalid date format',
          })
        : !isFuture(new Date(val))
        ? helpers.message({
              custom: 'The date must be in the future',
          })
        : val
);

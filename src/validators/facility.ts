import { IFacility } from '@/types';
import { Joi } from 'celebrate';
import { objectSchemaQuery } from './common';
import validator from 'validator';

const facilityFields: (keyof IFacility)[] = ['address', 'name'];

export const schemaGetFacilities = objectSchemaQuery(facilityFields);

export const schemaFacilityCreate = Joi.object({
    name: Joi.string().required(),
    address: Joi.string().required(),
    image: Joi.string().custom((val, helpers) =>
        validator.isURL(val) ? val : helpers.message({ custom: 'Invalid url' })
    ),
    location: Joi.object({
        type: Joi.string().valid('Point').required(),
        coordinates: Joi.array().length(2).items(Joi.number()),
    }).required(),
}).required();

export const schemaFacilityUpdate = Joi.object({
    name: Joi.string(),
    address: Joi.string(),
    image: Joi.string().custom((val, helpers) =>
        validator.isURL(val) ? val : helpers.message({ custom: 'Invalid url' })
    ),
});

export const schemaGetFacilitiesWithinParams = Joi.object({
    distance: Joi.number().required(),
    lat: Joi.number().required(),
    lng: Joi.number().required(),
}).required();

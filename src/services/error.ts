import createHttpError from 'http-errors';

export const handleCastError = (error: any) => {
    const message = `Invalid ${error.path}: ${error.value}`;

    return createHttpError(400, message);
};

export const handleDulicateFieldsError = (error: any) => {
    const value = Object.values(error.keyValue)[0];

    const message = `Dulicate field for value: '${value}'.Please use another value!`;

    return createHttpError(400, message);
};

export const handleValidationError = (error: any) => {
    const excludeMessage = 'validation failed:';
    const errorsIndex = error.message.indexOf(excludeMessage);

    const errors = error.message.slice(errorsIndex + excludeMessage.length);
    const message = `Invalid input:${errors}`;

    return createHttpError(400, message);
};

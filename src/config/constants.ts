export const PORT = process.env.PORT || 3000;

export const ENV = process.env.NODE_ENV;

export const DATABASE = process.env.DATABASE;

export const REDIS_URL = process.env.REDIS_URL;

export const ACCESS_TOKEN_EXPIRE = process.env.ACCESS_TOKEN_EXPIRE || '1d';
export const REFRESH_TOKEN_EXPIRE = process.env.REFRESH_TOKEN_EXPIRE || '1d';
export const REFRESH_TOKEN_REDIS_EXPIRE =
    parseInt(process.env.REFRESH_TOKEN_EXPIRE || '1d') * 60 * 60 * 24;
export const RESET_PASSWORD_TOKEN_EXPIRE = parseInt(
    process.env.RESET_PASSWORD_TOKEN_EXPIRE || '300'
);
export const BCRYPT_SALT = process.env.BCRYPT_SALT;

export const RESPONSE_MESSAGE = 'Success';

export const DATE_FORMAT = 'MM/dd/yyyy';

export const DEFAULT_AVATAR =
    'https://res.cloudinary.com/chriscloud1109/image/upload/v1651629584/media/default_gr1p4q.jpg';
export const DEFAULT_FACILITY_IMAGE =
    'https://res.cloudinary.com/chriscloud1109/image/upload/v1651918030/media/default_facility_mg3jws.jpg';

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 20;
export const DEFAULT_START_PAGE = 1;

export const EMAIL_FROM = process.env.EMAIL_FROM || '';

export const MAILTRAP_HOST = process.env.MAILTRAP_HOST;
export const MAILTRAP_PORT = parseInt(process.env.MAILTRAP_PORT!);
export const MAILTRAP_USER = process.env.MAILTRAP_USER;
export const MAILTRAP_PASS = process.env.MAILTRAP_PASS;

export const SENDGRID_USERNAME = process.env.SENDGRID_USERNAME;
export const SENDGRID_PASSWORD = process.env.SENDGRID_PASSWORD;

export const PORT = process.env.PORT || 3000;
export const ACCESS_TOKEN_EXPIRE = process.env.ACCESS_TOKEN_EXPIRE || '1d';
export const REFRESH_TOKEN_EXPIRE = process.env.REFRESH_TOKEN_EXPIRE || '1d';
export const REFRESH_TOKEN_REDIS_EXPIRE =
    parseInt(process.env.REFRESH_TOKEN_EXPIRE || '1d') * 60 * 60 * 24;
export const ENV = process.env.NODE_ENV;
export const DEFAULT_AVATAR =
    'https://res.cloudinary.com/chriscloud1109/image/upload/v1651629584/media/default_gr1p4q.jpg';
export const DEFAULT_FACILITY_IMAGE =
    'https://res.cloudinary.com/chriscloud1109/image/upload/v1651918030/media/default_facility_mg3jws.jpg';
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 20;
export const DEFAULT_START_PAGE = 1;
export const DATABASE = process.env.DATABASE;
export const HASH_ROUND = process.env.HASH_ROUND;
export const DATE_FORMAT = 'MM/dd/yyyy';
export const RESPONSE_MESSAGE = 'Success';
export const REDIS_URL = process.env.REDIS_URL;

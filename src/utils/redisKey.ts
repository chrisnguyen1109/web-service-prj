interface ToString {
    toString: () => string;
}

enum RedisKey {
    REFRESH_TOKEN = 'rftk',
    RESET_PASSWORD = 'rspwd',
}

const redisKey = (key: ToString | string, type: RedisKey) => {
    return `${typeof key === 'string' ? key : key.toString()}_${type}`;
};

export const redisRefreshTokenKey = (key: ToString | string) => {
    return redisKey(key, RedisKey.REFRESH_TOKEN);
};

export const redisResetPasswordKey = (key: ToString | string) => {
    return redisKey(key, RedisKey.RESET_PASSWORD);
};

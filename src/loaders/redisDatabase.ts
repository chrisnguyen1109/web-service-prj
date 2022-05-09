import { REDIS_URL } from '@/config';
import { createClient } from 'redis';

export const redisClient = createClient({
    url: REDIS_URL,
});

export const connectRedisDB = async () => {
    await redisClient.connect();

    console.log('Connect redis database successfully!');
};

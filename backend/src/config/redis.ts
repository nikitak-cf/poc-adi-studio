import { createClient } from 'redis';
import { env } from './env';

export type RedisClient = ReturnType<typeof createClient>;

let redisClient: RedisClient | null = null;

export async function getRedisClient(): Promise<RedisClient> {
  if (redisClient && redisClient.isOpen) {
    return redisClient;
  }

  redisClient = createClient({
    url: env.REDIS_URL,
    socket: {
      reconnectStrategy: (retries) => {
        if (retries > 10) {
          console.error('Redis: Too many reconnection attempts, giving up');
          return new Error('Too many reconnection attempts');
        }
        const delay = Math.min(retries * 50, 3000);
        console.log(`Redis: Reconnecting in ${delay}ms (attempt ${retries})`);
        return delay;
      },
    },
  });

  redisClient.on('error', (err) => console.error('Redis Client Error:', err));
  redisClient.on('connect', () => console.log('Redis: Connected'));
  redisClient.on('ready', () => console.log('Redis: Ready'));
  redisClient.on('end', () => console.log('Redis: Connection closed'));

  await redisClient.connect();
  return redisClient;
}

export async function disconnectRedis(): Promise<void> {
  if (redisClient && redisClient.isOpen) {
    await redisClient.quit();
    redisClient = null;
  }
}

process.on('SIGINT', async () => {
  await disconnectRedis();
  process.exit(0);
});

export default getRedisClient;
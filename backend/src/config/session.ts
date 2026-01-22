import session, { SessionOptions, Store } from 'express-session';
import RedisStore from 'connect-redis';
import { getRedisClient } from './redis';
import { env } from './env';

export async function createSessionStore(): Promise<Store | undefined> {
  try {
    const redisClient = await getRedisClient();
    const store = new (RedisStore as any)({
      client: redisClient,
      prefix: 'adi:sess:',
      ttl: env.SESSION_MAX_AGE / 1000,
    });
    console.log('Session store: Using Redis');
    return store;
  } catch (error) {
    console.warn('Redis unavailable, using memory store (sessions will not persist)');
    return undefined;
  }
}

export async function createSessionMiddleware() {
  const store = await createSessionStore();

  const sessionConfig: SessionOptions = {
    store,
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    name: 'adi.sid',
    cookie: {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: env.SESSION_MAX_AGE,
      path: '/',
    },
  };

  return session(sessionConfig);
}

declare module 'express-session' {
  interface SessionData {
    userId?: string;
    linearToken?: string;
    user?: {
      id: string;
      email: string;
      name: string;
      avatarUrl?: string;
      teamId: string;
    };
  }
}

export default createSessionMiddleware;
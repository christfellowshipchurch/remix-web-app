import Redis from 'ioredis';

let redis: Redis | null;

try {
  const redisUrlEnv = process.env.REDIS_URL;
  const isUrlConnectionString =
    typeof redisUrlEnv === 'string' &&
    (redisUrlEnv.startsWith('redis://') || redisUrlEnv.startsWith('rediss://'));

  const connectOptions = {
    connectTimeout: 10000, // Increase timeout for AWS connections
    retryStrategy: (times: number) => {
      const delay = Math.min(times * 200, 2000);
      return times >= 3 ? null : delay; // Retry 3 times with increasing delay
    },
  };

  // Vercel Redis provides REDIS_URL as redis(s):// — pass it to ioredis as a URL, not as `host`.
  if (isUrlConnectionString && redisUrlEnv) {
    redis = new Redis(redisUrlEnv, connectOptions);
  } else {
    redis = new Redis({
      host: redisUrlEnv || '127.0.0.1',
      port: Number(process.env.REDIS_PORT) || 6379,
      tls: process.env.NODE_ENV === 'production' ? {} : undefined,
      ...connectOptions,
    });
  }

  redis.on('connect', () => {
    // eslint-disable-next-line no-console
    console.log('✅ Redis connected successfully');
  });

  redis.on('error', (error: Error & { code?: string }) => {
    console.error('Redis connection error details:', {
      code: error.code,
      message: error.message,
      connectionMode: isUrlConnectionString ? 'url' : 'host',
      host:
        isUrlConnectionString && redisUrlEnv
          ? '(REDIS_URL)'
          : redisUrlEnv || '127.0.0.1',
      port: Number(process.env.REDIS_PORT) || 6379,
      environment: process.env.NODE_ENV,
      stack: error.stack,
    });

    if (error.code === 'ETIMEDOUT' || error.code === 'ECONNREFUSED') {
      console.error(
        '⚠️ Redis connection failed, falling back to direct API calls',
      );
      redis = null;
    } else {
      console.error('Redis error:', error);
    }
  });
} catch (error) {
  console.error(
    '⚠️ Redis initialization failed, falling back to direct API calls',
    error,
  );
  redis = null;
}

export default redis;

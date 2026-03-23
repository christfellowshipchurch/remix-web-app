import Redis from "ioredis";

let redis: Redis | null;

try {
  const redisUrlEnv = process.env.REDIS_URL;
  const isUrlConnectionString =
    typeof redisUrlEnv === "string" &&
    (redisUrlEnv.startsWith("redis://") ||
      redisUrlEnv.startsWith("rediss://"));
  // #region agent log
  fetch(
    "http://127.0.0.1:7517/ingest/d70a88e1-509d-4303-ae4f-9cfd513bea71",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "df7844",
      },
      body: JSON.stringify({
        sessionId: "df7844",
        hypothesisId: "A",
        location: "redis-config.ts:pre-connect",
        message: "Redis env interpretation (Vercel uses full URL string)",
        data: {
          hasRedisUrl: Boolean(redisUrlEnv),
          isUrlConnectionString,
          redisPortSet: Boolean(process.env.REDIS_PORT),
          nodeEnv: process.env.NODE_ENV ?? null,
          tlsOptionInUse: process.env.NODE_ENV === "production",
        },
        timestamp: Date.now(),
      }),
    }
  ).catch(() => {});
  // #endregion

  redis = new Redis({
    host: process.env.REDIS_URL || "127.0.0.1",
    port: Number(process.env.REDIS_PORT) || 6379,
    tls: process.env.NODE_ENV === "production" ? {} : undefined,
    connectTimeout: 10000, // Increase timeout for AWS connections
    retryStrategy: (times) => {
      const delay = Math.min(times * 200, 2000);
      return times >= 3 ? null : delay; // Retry 3 times with increasing delay
    },
  });

  redis.on("connect", () => {
    // eslint-disable-next-line no-console
    console.log("✅ Redis connected successfully");
  });

  redis.on("error", (error: Error & { code?: string }) => {
    console.error("Redis connection error details:", {
      code: error.code,
      message: error.message,
      host: process.env.REDIS_URL || "127.0.0.1",
      port: Number(process.env.REDIS_PORT) || 6379,
      environment: process.env.NODE_ENV,
      stack: error.stack,
    });

    if (error.code === "ETIMEDOUT" || error.code === "ECONNREFUSED") {
      console.error(
        "⚠️ Redis connection failed, falling back to direct API calls"
      );
      redis = null;
    } else {
      console.error("Redis error:", error);
    }
  });
} catch (error) {
  console.error(
    "⚠️ Redis initialization failed, falling back to direct API calls",
    error
  );
  redis = null;
}

export default redis;

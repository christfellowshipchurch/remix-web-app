import Redis from "ioredis";

let redis: Redis | null = null;

try {
  redis = new Redis({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT) || 6379,
    tls: process.env.NODE_ENV === "production" ? {} : undefined,
    connectTimeout: 10000, // Increase timeout for AWS connections
    retryStrategy: (times) => {
      const delay = Math.min(times * 200, 2000);
      return times >= 3 ? null : delay; // Retry 3 times with increasing delay
    },
  });

  redis.on("connect", () => {
    console.log("✅ Redis connected successfully");
  });

  redis.on("error", (error: Error & { code?: string }) => {
    console.error("Redis connection error details:", {
      code: error.code,
      message: error.message,
      host: process.env.REDIS_HOST || "127.0.0.1",
      port: Number(process.env.REDIS_PORT) || 6379,
      environment: process.env.NODE_ENV,
      stack: error.stack,
    });

    if (error.code === "ETIMEDOUT" || error.code === "ECONNREFUSED") {
      console.log(
        "⚠️ Redis connection failed, falling back to direct API calls"
      );
      redis = null;
    } else {
      console.error("Redis error:", error);
    }
  });
} catch (error) {
  console.log(
    "⚠️ Redis initialization failed, falling back to direct API calls",
    error
  );
  redis = null;
}

export default redis;

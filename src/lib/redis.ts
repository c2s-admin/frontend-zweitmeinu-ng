import Redis from "ioredis";
import RedisMock from "ioredis-mock";

const redis =
  process.env.NODE_ENV === "test" || !process.env.REDIS_URL
    ? new (RedisMock as unknown as typeof Redis)()
    : new Redis(process.env.REDIS_URL);

export { redis };

import { Redis } from "ioredis";
// redis client library for nodejs

const redis = new Redis();

async function ioRedis() {
  try {
    await redis.set("key", "value");

    const value = await redis.get("key");

    console.log(value);
  } catch (error) {
    console.error(error);
  } finally {
    redis.quit();
  }
}

ioRedis();

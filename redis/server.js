import redis from "redis";

// connects to the redis server
const client = redis.createClient({
  host: "localhost",
  port: 6379,
});

// event listener

client.on("error", (error) => console.log("Redis client error occured!"));

async function testRedisConnection() {
  try {
    await client.connect();

    console.log("Connected to redis");

    await client.set("key", "swag");

    const extractValue = await client.get("key");

    console.log(extractValue);

    const deleteCount = await client.del("key");
    console.log(deleteCount);

    const extractUpdatedValue = await client.get("key");
    console.log(extractUpdatedValue);

    await client.set("count", "100");
    const incrementCount = await client.incr("count");

    console.log(incrementCount);

    const decrementCount = await client.decr("count");
    console.log(decrementCount);
    await client.decr("count");
    await client.decr("count");
    await client.decr("count");
    await client.decr("count");
    console.log(await client.get("count"));
  } catch (error) {
    console.error(error);
  } finally {
    await client.quit();
  }
}

testRedisConnection();

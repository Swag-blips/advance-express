import redis from "redis";

// connects to the redis server
const client = redis.createClient({
  host: "localhost",
  port: 6379,
});

// event listener

client.on("error", (error) => console.log("Redis client error occured!"));

async function redisDataStructures() {
  try {
    await client.connect();
    // Strings -> SET, GET,MSET,MGET

    // await client.set("user:name", "Swag azrael");

    // const name = await client.get("user:name");

    // console.log(name);

    // await client.mSet([
    //   "user:email",
    //   "swag@test.com",
    //   "user:age",
    //   "21",
    //   "user:country",
    //   "nigeria",
    // ]);

    // // const [email, age, country] = await client.mGet([
    // //   "user:email",
    // //   "user:age",
    // //   "user:country",
    // // ]);

    // // console.log(email, age, country);

    // // //lists -> LPUSH. RPUSH,LRANGE,LPOP,RPOP

    // // await client.lPush("notes", ["note1", "note2", "note3"]);

    // // const extractAllNotes = await client.lRange("notes", 0, -1);
    // // console.log(extractAllNotes);

    // // sets - SADD, SMEMBERS,SISMEMBER, SREM

    // await client.sAdd("user:nickname", ["john", "varun", "xyz"]);

    // const extractUserNicknames = await client.sMembers("user:nickname");

    // console.log(extractUserNicknames);

    // const isVarun = await client.sIsMember("user:nickname", "varun");
    // console.log(isVarun);

    // await client.sRem("user:nickname", "xyz");

    // console.log(await client.sMembers("user:nickname"));
  } catch (error) {
    console.error(error);
  } finally {
    client.quit();
  }
}

redisDataStructures();

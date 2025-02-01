// -> publisher -> send message-> channel - subscriber will receive and consume this message
import redis from "redis";

// connects to the redis server
const client = redis.createClient({
  host: "localhost",
  port: 6379,
});

// event listener

client.on("error", (error) => console.log("Redis client error occured!"));

async function testPubSub() {
  try {
    await client.connect();

    const subscriber = client.duplicate(); // create a new client

    await subscriber.connect(); // connect to redis server for the subscriber

    await subscriber.subscribe("dummy-channel", (message, channel) => {
      console.log(`received message from ${channel}: ${message}`);
    });

    // publish message to the dummy channel
    await client.publish("dummy-channel", "Some dummy data from publisher");
    await client.publish("dummy-channel", "Im swag and i like to tango!");

    await new Promise((resolve) => setTimeout(resolve, 1000));

    await subscriber.unsubscribe("dummy-channel");
    await subscriber.quit(); //close the subscriber connection

    //pipelining and transactions

    const multi = client.multi();

    multi.set("key-transaction1", "value1");

    multi.set("key-transaction2", "value2");

    multi.get("key-transaction1");
    multi.get("key-transaction2");

    const results = await multi.exec();

    console.log(results);

    const pipeline = client.multi();

    
    multi.set("pipeline-1", "value1");

    multi.set("pipeline-2", "value2");
  } catch (error) {
    console.error(error);
  } finally {
    client.quit();
  }
}

testPubSub();

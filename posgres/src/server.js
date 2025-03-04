require("dotenv").config();

const { createUsersTable, insertUser } = require("./concepts/basic-queries");

async function testBasicQueries() {
  try {
    await createUsersTable();
  } catch (error) {
    console.log("Error", error);
  }
}

async function testAllQueries() {
  //   await testBasicQueries();

  await insertUser("user_john", "john@example.com");
  await insertUser("user_sarah", "sarah@example.com");
  await insertUser("user_mike", "mike@example.com");
  await insertUser("user_emma", "emma@example.com");
  await insertUser("user_david", "david@example.com");
}

testAllQueries();

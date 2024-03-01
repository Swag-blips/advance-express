require("dotenv").config();

const { createUsersTable } = require("./concepts/basic-queries");

async function testBasicQueries() {
  try {
    await createUsersTable();
  } catch (error) {
    console.log("Error", error);
  }
}

async function testAllQueries() {
  await testBasicQueries();
}

testAllQueries();

const db = require("../db/db");

async function createUsersTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users(
     id SERIAL PRIMARY KEY,
     username VARCHAR(50) UNIQUE NOT NULL,
     email VARCHAR(255) UNIQUE NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
    `;

  try {
    await db.query(createTableQuery);
    console.log("Users table created successfully");
  } catch (error) {
    console.error("Error while creating users table", error);
  }
}


async function insertNewRecord(){
    
}

module.exports = { createUsersTable };
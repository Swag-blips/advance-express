const { Pool } = require("pg");

// create a new

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function query(text, params) {
  const start = Date.now();

  try {
    const result = await pool.query(text, params);

    //execute time

    const duration = Date.now() - start;

    console.log(`Executed query: ${{ text, duration, rows: result.rowCount }}`);
  } catch (error) {
    console.log(error);
  }
}

module.exports = { query };

const postgres = require("postgres");

const sql = postgres({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  ssl: process.env.DB_SSL,
});

const testDBConnection = async () => {
  try {
    await sql`SELECT 1 + 1`;
    console.log("Database connection successful");
  } catch (error) {
    console.error("Database connection failed:", error);
    throw error;
  }
};

module.exports = { sql, testDBConnection };

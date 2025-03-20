require("dotenv").config();
const server = require("./app");
const { sql, testDBConnection } = require("./dbConnection");
const { createDBtables, dbSettings } = require("./dbCreating");
const { validateEnv } = require("./envChecker");

validateEnv();

(async () => {
  try {
    await testDBConnection();
    await createDBtables();
    await dbSettings();
    server.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error);
    await sql.end();
    process.exit(1);
  }
})();

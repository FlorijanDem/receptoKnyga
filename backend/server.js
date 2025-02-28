require("dotenv").config();
const server = require("./app");
const { sql, testDBConnection } = require("./dbConnection");
const { createDBtables } = require("./dbCreating");

(async () => {
  try {
    await testDBConnection();
    await createDBtables();
    server.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error);
    await sql.end();
    process.exit(1);
  }
})();

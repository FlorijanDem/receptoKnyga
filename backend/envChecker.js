const isNaString = (value) => typeof value !== "string";
const validateEnv = () => {
  console.log("Enviroment messages:");

  if (!process.env.PORT) {
    console.log("\x1b[33m", "PORT not found, using default port 3001");
    process.env.PORT = 3001;
  } else if (isNaN(process.env.PORT)) {
    console.log("\x1b[31m", "PORT must be number");
  }

  if (!process.env.DB_PORT) {
    console.log("\x1b[33m", "DB_PORT not found, using default port 5432");
    process.env.DB_PORT = 5432;
  } else if (isNaN(process.env.DB_PORT)) {
    console.log("\x1b[31m", "DB_PORT must be number");
  }

  if (!process.env.DB_NAME) {
    console.log("\x1b[33m", "DB_PORT not found, using default name postgres");
    process.env.DB_NAME = "postgres";
  } else if (isNaString(process.env.DB_NAME)) {
    console.log("\x1b[31m", "DB_NAME must be string");
  }
  // Reset color 
  console.log("\x1b[0m");
};

module.exports = { validateEnv };

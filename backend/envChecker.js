const isNaString = (value) => typeof value !== "string";
const validateEnv = () => {
  if (process.env.DISABLE_CHECKING == "true") {
    return 0;
  }
  console.log("Enviroment messages:");

  let warnings = 0;
  let errors = 0;

  //  client url
  if (!process.env.FRONTEND_URL) {
    console.log("\x1b[33m", "CORS response to all sources");
    warnings++;
  }

  // app port
  if (!process.env.PORT) {
    console.log("\x1b[33m", "PORT not found, using default port 3001");
    process.env.PORT = 3001;
    warnings++;
  } else if (isNaN(process.env.PORT)) {
    console.log("\x1b[31m", "PORT must be number");
    errors++;
  }

  // database config
  if (!process.env.DB_HOST) {
    // If nothing exist will be localhost without addictionall set up
    console.log("\x1b[33m", "DB_HOST not found, using default host localhost");
    warnings++;
  }

  if (!process.env.DB_PORT) {
    console.log("\x1b[33m", "DB_PORT not found, using default port 5432");
    process.env.DB_PORT = 5432;
    warnings++;
  } else if (isNaN(process.env.DB_PORT)) {
    console.log("\x1b[31m", "DB_PORT must be number");
    errors++;
  }

  if (!process.env.DB_NAME) {
    console.log("\x1b[33m", "DB_PORT not found, using default name postgres");
    process.env.DB_NAME = "postgres";
    warnings++;
  } else if (isNaString(process.env.DB_NAME)) {
    console.log("\x1b[31m", "DB_NAME must be string");
    errors++;
  }

  if (!process.env.DB_USER) {
    console.log("\x1b[33m", "DB_USER not found, using username");
    warnings++;
  }

  if (!process.env.DB_PASS) {
    console.log(
      "\x1b[33m",
      "DB_PASS not found, using default password postgres"
    );
    process.env.DB_PASS = "postgres";
    warnings++;
  }

  // jwt config
  if (!process.env.JWT_SECRET) {
    console.log(
      "\x1b[33m",
      "JWT_SECRET not found, using default password password"
    );
    process.env.JWT_SECRET = "password";
    warnings++;
  }

  if (!process.env.JWT_EXPIRES_IN) {
    console.log("\x1b[33m", "JWT_EXPIRES_IN not found, using default time 90d");
    process.env.JWT_EXPIRES_IN = "90d";
    warnings++;
  }

  if (!process.env.JWT_COOKIE_EXPIRES_IN) {
    console.log(
      "\x1b[33m",
      "JWT_COOKIE_EXPIRES_IN not found, using default time 90"
    );
    process.env.JWT_COOKIE_EXPIRES_IN = 90;
    warnings++;
  }

  if (warnings == 0 && errors == 0) {
    console.log("\x1b[32m", "You do not have any warnings or errors");
  } else {
    console.log("\x1b[33m", `You have ${warnings} warnings`);
    console.log("\x1b[31m", `You have ${errors} errors`);
  }
  // Reset color
  console.log("\x1b[0m");
};

module.exports = { validateEnv };

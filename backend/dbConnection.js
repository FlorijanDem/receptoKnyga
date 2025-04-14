//  Pageidautinas papildomas klaidų logavimas užklausoms (naudoti async/await ir try/catch visose užklausose)
// Pavyzdys:
// try {
//   const result = await sql`SELECT * FROM users`;
// } catch (err) {
//   console.error('[dbConnection] Užklausos klaida:', err);
// }

const postgres = require("postgres");

// Sukuriamas pool pagal .env konfigūraciją.
// Visi parametrai paaiškinti .env faile.
const sql = postgres({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  // Ryšių tvarkyklės konfigūracija pagal .env failą.
  ssl: process.env.DB_SSL,
  max: parseInt(process.env.DB_POOL_MAX || "10"),
  // Minimalus nuolat laikomų ryšių skaičius reikalingas, kad išvengti šalto starto, kai reikia laukti naujo ryšio užmezgimo.
  min: parseInt(process.env.DB_POOL_MIN || "1"),
  idle_timeout: parseInt(process.env.DB_POOL_IDLE_TIMEOUT || "30"),
  connect_timeout: parseInt(process.env.DB_POOL_CONNECT_TIMEOUT || "10"),
  statement_timeout: parseInt(process.env.DB_POOL_STATEMENT_TIMEOUT || "1000"),
});

// Funkcija testuoti ar veikia prisijungimas prie DB
const testDBConnection = async () => {
  try {
    await sql`SELECT 1 + 1`;
    console.log("Database connection successful");
  } catch (error) {
    console.error("Database connection failed:", error);
    throw error;
  }
};

// ---
// 2. Ryšių uždarymas ir klaidų tvarkymas
// ---
// Graceful shutdown: uždaro visus ryšius su DB kai aplikacija stabdoma (pvz., CTRL+C, serverio restartas)
// Tai padeda išvengti "zombių" ryšių, kurie lieka atidaryti DB pusėje.
const gracefulShutdown = async (signal) => {
  console.log(`\n[dbConnection] Gauta ${signal}. Uždarinėjami DB ryšiai...`);
  try {
    await sql.end({ timeout: 5 }); // Palaukia iki 5 sekundžių, kol užsidarys visi ryšiai
    console.log("[dbConnection] Visi DB ryšiai sėkmingai uždaryti.");
    process.exit(0);
  } catch (err) {
    console.error("[dbConnection] Klaida uždarant DB ryšius:", err);
    process.exit(1);
  }
};

// SIGINT – spaudžiant CTRL+C terminale
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
// SIGTERM – procesas nutraukiamas iš išorės (pvz., Docker/Kubernetes/kill)
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

// ---
// 3. Globalūs klaidų gaudytojai
// ---
// uncaughtException – kai įvyksta nepagauta (neapdorota) klaida sinchroniniame kode
process.on("uncaughtException", async (err) => {
  console.error("[Global] Nepagauta klaida (uncaughtException):", err);
  try {
    await sql.end({ timeout: 5 });
    console.log("[dbConnection] DB ryšiai uždaryti po uncaughtException.");
  } catch (e) {
    console.error(
      "[dbConnection] Klaida uždarant DB ryšius po uncaughtException:",
      e
    );
  } finally {
    process.exit(1);
  }
});

// unhandledRejection – kai Promise klaida nepagauta (pvz., pamirštas .catch arba await be try/catch)
// eslint-disable-next-line no-unused-vars
process.on("unhandledRejection", async (reason, promise) => {
  console.error(
    "[Global] Nepagautas Promise klaidos atvejis (unhandledRejection):",
    reason
  );
  try {
    await sql.end({ timeout: 5 });
    console.log("[dbConnection] DB ryšiai uždaryti po unhandledRejection.");
  } catch (e) {
    console.error(
      "[dbConnection] Klaida uždarant DB ryšius po unhandledRejection:",
      e
    );
  } finally {
    process.exit(1);
  }
});

module.exports = { sql, testDBConnection };

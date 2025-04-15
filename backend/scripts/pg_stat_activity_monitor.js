// pg_stat_activity monitoringo skriptas
// Šis skriptas prisijungia prie DB ir išveda aktyvias jungtis bei ilgai trunkančias užklausas
// Naudojimas: node scripts/pg_stat_activity_monitor.js

require("dotenv").config({ path: "./.env" });
const postgres = require("postgres");

const sql = postgres({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  ssl: process.env.DB_SSL,
  max: 1,
});

async function showActiveConnections() {
  try {
    const rows = await sql`
      SELECT pid, usename, client_addr, state, now() - query_start AS exec_time, query
      FROM pg_stat_activity
      WHERE datname = ${process.env.DB_NAME}
      ORDER BY exec_time DESC;
    `;
    console.log("Aktyvios jungtys ir užklausos:");
    rows.forEach((row) => {
      console.log(
        `PID: ${row.pid} | User: ${row.usename} | State: ${row.state} | IP: ${row.client_addr} | Trukmė: ${row.exec_time} | Užklausa: ${row.query?.slice(0, 120)}`
      );
    });
  } catch (err) {
    console.error("Klaida gaunant pg_stat_activity:", err);
  } finally {
    await sql.end();
  }
}

showActiveConnections();

const fs = require("fs").promises;
const path = require("path");
const { sql } = require("../dbConnection");

const LOGS_FILE = path.join(__dirname, "../logs/logs.txt");

let nextId = 1;

exports.saveLogToDb = async (userId, userIp, action, details) => {
  let username = null;
  if (userId) {
    const [user] = await sql`
      SELECT username
      FROM users
      WHERE id = ${userId}
    `;
    username = user?.username || null;
  }

  const logsContent = await fs.readFile(LOGS_FILE, "utf8");
  const logs = logsContent
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter((log) => log && log.id);
  const maxId = logs.length
    ? Math.max(...logs.map((log) => parseInt(log.id, 10)))
    : 0;
  nextId = maxId + 1;

  const logEntry = {
    id: (nextId++).toString(),
    user_id: userId || null,
    username: username || null,
    user_ip: userIp || null,
    action: action || "Unknown",
    details: typeof details === "object" ? details : details,
    timestamp: new Date().toISOString(),
  };

  const logLine = JSON.stringify(logEntry) + "\n";
  await fs.appendFile(LOGS_FILE, logLine, "utf8");


  return logEntry;
};

exports.getLogs = async ({
  username,
  action,
  startDate,
  endDate,
  page = 1,
  limit = 10,
}) => {
  const offset = (page - 1) * limit;

  const logsContent = await fs.readFile(LOGS_FILE, "utf8");

  const logs = logsContent
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => JSON.parse(line));

  logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  let filteredLogs = logs;
  if (username && username.length >= 1) {
    filteredLogs = filteredLogs.filter(
      (log) => log.username && log.username.toLowerCase().startsWith(username.toLowerCase())
    );
  }
  if (action) {
    filteredLogs = filteredLogs.filter((log) => log.action === action);
  }
  if (startDate) {
    filteredLogs = filteredLogs.filter(
      (log) => new Date(log.timestamp) >= new Date(startDate)
    );
  }
  if (endDate) {
    const endDateTime = new Date(endDate);
    endDateTime.setHours(23, 59, 59, 999);
    filteredLogs = filteredLogs.filter(
      (log) => new Date(log.timestamp) <= endDateTime
    );
  }

  const total = filteredLogs.length;
  const paginatedLogs = filteredLogs.slice(offset, offset + limit);

  return { logs: paginatedLogs, total, page, limit };
};
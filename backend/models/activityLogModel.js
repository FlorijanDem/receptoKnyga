const { sql } = require("../dbConnection");
const logger = require("../logger").logger;

exports.saveLogToDb = async (userId, userIp, action, details) => {
  try {
    const [savedLog] = await sql`
      INSERT INTO activity_logs (user_id, user_ip, action, details)
      VALUES (${userId}, ${userIp}, ${action}, ${details})
      RETURNING *
    `;

    return savedLog;
  } catch (error) {
    logger.error("[activityLogModel] Failed to save log to DB", {
      error: error.message,
      userId,
      action,
      details,
    });
    throw error;
  }
};

exports.getLogs = async ({ userId, action, startDate, endDate, page = 1, limit = 10 }) => {
  try {
    const offset = (page - 1) * limit;
    let query = sql`SELECT * FROM activity_logs`;
    const conditions = [];

    if (userId) {
      conditions.push(sql`user_id = ${userId}`);
    }
    if (action) {
      conditions.push(sql`action = ${action}`);
    }
    if (startDate) {
      conditions.push(sql`timestamp >= ${startDate}`);
    }
    if (endDate) {
      conditions.push(sql`timestamp <= ${endDate}`);
    }


    if (conditions.length > 0) {
      const whereClause = conditions.reduce((acc, condition, index) => {
        return index === 0
          ? sql`${acc} WHERE ${condition}`
          : sql`${acc} AND ${condition}`;
      }, sql``);
      query = sql`${query} ${whereClause}`;
    }

  
    query = sql`${query} ORDER BY timestamp DESC LIMIT ${limit} OFFSET ${offset}`;
    const logs = await query;
    const [{ count }] = await sql`SELECT COUNT(*) FROM activity_logs`;

    return { logs, total: parseInt(count), page, limit };
  } catch (error) {
    logger.error("[activityLogModel] Failed to fetch logs", {
      error: error.message,
      userId,
      action,
      startDate,
      endDate,
      page,
      limit,
    });
    throw error;
  }
};
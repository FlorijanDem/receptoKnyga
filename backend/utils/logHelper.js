const logger = require("../logger").logger;
const { saveLogToDb } = require("../models/activityLogModel");

const logUserActivity = async (req, action, details = "") => {
  const userId = req.user?.id || null;
  const userIp = req.ip || req.headers["x-forwarded-for"] || "unknown";
  try {
    await saveLogToDb(userId, userIp, action, details);

  } catch (error) {
    logger.error("[logHelper] Failed to log user action", {
      error: error.message,
      userId,
      userIp,
      action,
      details,
      url: req.originalUrl
    });
    throw error;
  }
};

module.exports = logUserActivity;
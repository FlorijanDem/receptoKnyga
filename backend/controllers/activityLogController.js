const { getLogs } = require("../models/activityLogModel");
const logger = require("../logger").logger;

exports.fetchLogs = async (req, res) => {
  try {
    const { username, action, startDate, endDate, page, limit } = req.query;
    const logs = await getLogs({
      username,
      action,
      startDate,
      endDate,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
    });
    res.json(logs);
  } catch (error) {
    logger.error("[logController] Failed to fetch logs", {
      error: error.message,
      userId: req.user?.id,
      query: req.query,
      stack: error.stack,
    });
    res.status(500).json({
      message: "Failed to fetch logs",
      error: error.message,
    });
  }
};
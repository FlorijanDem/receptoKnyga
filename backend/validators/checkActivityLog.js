const logUserActivity = require("../utils/logHelper");
const logger = require("../logger").logger;
const rateLimit = require("express-rate-limit");

exports.checkActivityLogBody = async (req, res, next) => {
  try {
    const { pathname } = req.body;
    if (!pathname) {
      throw new Error("Pathname is required");
    }
    await logUserActivity(req, "Visited page", pathname);
    res.sendStatus(200);
  } catch (error) {
    logger.error("[logRoutes] Failed to log page view", {
      error: error.message,
      userId: req.user?.id,
      pathname: req.body.pathname,
    });
    res.status(500).json({ error: "Failed to log page view" });
  }
};

exports.pageViewLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
